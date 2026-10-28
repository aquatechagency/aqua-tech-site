/*!
 * Aqua.Tech - Digital Core
 * Self-contained WebGL renderer for the hero: a structured particle core with
 * four orbital data streams representing DATA -> SOFTWARE -> AI -> GROWTH.
 *
 * No external dependency. Device tiered, pauses off-screen, disposes cleanly,
 * and leaves the CSS hero intact as the fallback when WebGL is unavailable.
 */
/* Boot once the main thread is idle. The core is decoration, and the
   display check below forces a full style recalc if it runs while the page
   is still parsing (87-169ms tasks in mobile Lighthouse runs). */
(function (boot) {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(boot, { timeout: 2000 });
  } else {
    window.setTimeout(boot, 200);
  }
})(function () {
  "use strict";

  var host = document.querySelector("[data-aqua-core]");
  if (!host) return;

  /* Off switch: a host hidden with display:none (aqua-techflux.css does this
     for the hero) never gets a WebGL context. By idle time the stylesheets
     have long applied, so the computed value is final. Remove that CSS rule
     to bring the core back. */
  if (window.getComputedStyle(host).display === "none") {
    host.setAttribute("data-aqua-core-state", "disabled");
    return;
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var saveData = Boolean(navigator.connection && navigator.connection.saveData);

  /* ---------------------------------------------------------------- tiering */

  var TIER_ORDER = ["minimal", "mobile", "tablet", "desktop"];

  function resolveTier() {
    var width = window.innerWidth;
    var memory = navigator.deviceMemory || 4;
    var cores = navigator.hardwareConcurrency || 4;
    var coarse = window.matchMedia("(pointer: coarse)").matches;

    if (saveData || memory <= 2 || cores <= 2) return "minimal";

    var index = width < 768 ? 1 : width < 1280 ? 2 : 3;

    /* A touchscreen is usually a weaker GPU for its size, so step down one
       tier rather than collapsing a large tablet to the phone budget. */
    if (coarse) index = Math.max(1, index - 1);

    return TIER_ORDER[index];
  }

  var TIERS = {
    minimal: { shell: 700, stream: 260, field: 0, dpr: 1.25, rings: 3, ringSegments: 64 },
    mobile: { shell: 1250, stream: 460, field: 180, dpr: 1.5, rings: 4, ringSegments: 84 },
    tablet: { shell: 2600, stream: 880, field: 380, dpr: 1.75, rings: 4, ringSegments: 110 },
    desktop: { shell: 4200, stream: 1400, field: 640, dpr: 2, rings: 4, ringSegments: 148 }
  };

  var tier = resolveTier();
  var config = TIERS[tier];

  /* ------------------------------------------------------------- gl context */

  var canvas = document.createElement("canvas");
  canvas.className = "aqua-core-canvas";
  canvas.setAttribute("aria-hidden", "true");

  var glOptions = {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
    powerPreference: "low-power",
    preserveDrawingBuffer: false
  };

  var gl = null;
  try {
    gl =
      canvas.getContext("webgl", glOptions) ||
      canvas.getContext("experimental-webgl", glOptions);
  } catch (error) {
    gl = null;
  }

  if (!gl) {
    host.setAttribute("data-aqua-core-state", "fallback");
    return;
  }

  /* --------------------------------------------------------------- shaders */

  var VERT = [
    "precision highp float;",
    "attribute vec3 a_p0;",
    "attribute vec3 a_p1;",
    "attribute vec4 a_params;",
    "attribute vec4 a_style;",
    "uniform mat4 u_projection;",
    "uniform mat4 u_view;",
    "uniform mat4 u_model;",
    "uniform float u_time;",
    "uniform float u_pixelRatio;",
    "uniform float u_focal;",
    "uniform float u_energy;",
    "varying vec3 v_color;",
    "varying float v_alpha;",
    "vec3 twistY(vec3 p, float a) {",
    "  float s = sin(a); float c = cos(a);",
    "  return vec3(p.x * c - p.z * s, p.y, p.x * s + p.z * c);",
    "}",
    "void main() {",
    "  float kind = a_params.x;",
    "  vec3 pos;",
    "  float alpha = 1.0;",
    "  if (kind < 0.5) {",
    "    vec3 dir = a_p0;",
    "    float breathe = 0.052 * sin(u_time * 0.62 + a_params.z);",
    "    float ripple = 0.034 * sin(u_time * 0.29 + dir.y * 4.1 + dir.x * 2.3);",
    "    pos = dir * (a_params.y + breathe + ripple);",
    "    pos = twistY(pos, dir.y * 0.85 + u_time * 0.05);",
    "    alpha = 0.42 + 0.26 * sin(u_time * 0.9 + a_params.z);",
    "  } else if (kind < 1.5) {",
    "    float theta = a_params.z + u_time * a_params.w;",
    "    pos = a_params.y * (cos(theta) * a_p0 + sin(theta) * a_p1);",
    "    float head = fract(theta / 6.2831853);",
    "    alpha = 0.30 + 0.70 * pow(head, 2.4);",
    "  } else if (kind < 2.5) {",
    "    pos = a_p0 + vec3(0.0, 0.075 * sin(u_time * 0.21 + a_params.z), 0.0);",
    "    alpha = 0.16 + 0.12 * sin(u_time * 0.44 + a_params.z);",
    "  } else {",
    "    pos = a_p0;",
    "    alpha = 1.0;",
    "  }",
    "  vec4 world = u_model * vec4(pos, 1.0);",
    "  vec4 viewPos = u_view * world;",
    "  gl_Position = u_projection * viewPos;",
    "  float depth = -viewPos.z;",
    "  float fog = smoothstep(6.4, 2.1, depth);",
    "  v_color = a_style.rgb;",
    "  v_alpha = clamp(alpha, 0.0, 1.0) * fog * u_energy;",
    "  gl_PointSize = max(1.0, a_style.a * u_pixelRatio * (u_focal / max(depth, 0.25)));",
    "}"
  ].join("\n");

  var FRAG = [
    "precision mediump float;",
    "varying vec3 v_color;",
    "varying float v_alpha;",
    "uniform float u_isLine;",
    "void main() {",
    "  float mask = 1.0;",
    "  if (u_isLine < 0.5) {",
    "    float d = length(gl_PointCoord - vec2(0.5));",
    "    mask = smoothstep(0.5, 0.0, d);",
    "    mask = mask * mask;",
    "  }",
    "  float a = mask * v_alpha;",
    "  if (a <= 0.001) discard;",
    "  gl_FragColor = vec4(v_color * a, a);",
    "}"
  ].join("\n");

  function compile(type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function bailToFallback() {
    host.setAttribute("data-aqua-core-state", "fallback");
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
  }

  var vertexShader = compile(gl.VERTEX_SHADER, VERT);
  var fragmentShader = compile(gl.FRAGMENT_SHADER, FRAG);

  if (!vertexShader || !fragmentShader) {
    bailToFallback();
    return;
  }

  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    bailToFallback();
    return;
  }

  host.appendChild(canvas);
  host.setAttribute("data-aqua-core-state", "live");
  gl.useProgram(program);

  var attribs = {
    p0: gl.getAttribLocation(program, "a_p0"),
    p1: gl.getAttribLocation(program, "a_p1"),
    params: gl.getAttribLocation(program, "a_params"),
    style: gl.getAttribLocation(program, "a_style")
  };

  var uniforms = {
    projection: gl.getUniformLocation(program, "u_projection"),
    view: gl.getUniformLocation(program, "u_view"),
    model: gl.getUniformLocation(program, "u_model"),
    time: gl.getUniformLocation(program, "u_time"),
    pixelRatio: gl.getUniformLocation(program, "u_pixelRatio"),
    focal: gl.getUniformLocation(program, "u_focal"),
    energy: gl.getUniformLocation(program, "u_energy"),
    isLine: gl.getUniformLocation(program, "u_isLine")
  };

  /* -------------------------------------------------------------- geometry */

  var STRIDE = 14;

  /* Brand palette only - primary, action, and the teal already used by the
     scroll progress gradient. Nothing outside the existing identity. */
  var PALETTE = {
    shellNear: [0.537, 0.808, 1.0],
    shellFar: [0.0, 0.706, 1.0],
    data: [0.396, 0.886, 0.847],
    software: [0.537, 0.808, 1.0],
    ai: [0.0, 0.706, 1.0],
    growth: [0.784, 0.902, 1.0]
  };

  var RING_TINTS = [PALETTE.data, PALETTE.software, PALETTE.ai, PALETTE.growth];
  var RING_RADII = [1.34, 1.14, 1.58, 1.78];
  var RING_SPEEDS = [0.3, -0.23, 0.185, -0.145];
  var RING_TILTS = [
    [0.42, 0.18],
    [-0.62, 0.95],
    [1.12, -0.35],
    [0.18, 1.72]
  ];

  function ringBasis(tiltX, tiltY) {
    var cx = Math.cos(tiltX);
    var sx = Math.sin(tiltX);
    var cy = Math.cos(tiltY);
    var sy = Math.sin(tiltY);

    var u = [cy, 0, -sy];
    var v = [0, cx, sx];

    var dot = u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
    v = [v[0] - u[0] * dot, v[1] - u[1] * dot, v[2] - u[2] * dot];

    var len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) || 1;
    return { u: u, v: [v[0] / len, v[1] / len, v[2] / len] };
  }

  var bases = RING_TILTS.map(function (tilt) {
    return ringBasis(tilt[0], tilt[1]);
  });

  var pointData = [];
  var lineData = [];

  function pushVertex(target, p0, p1, params, style) {
    target.push(
      p0[0], p0[1], p0[2],
      p1[0], p1[1], p1[2],
      params[0], params[1], params[2], params[3],
      style[0], style[1], style[2], style[3]
    );
  }

  function mixColor(a, b, t) {
    return [
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t
    ];
  }

  var golden = Math.PI * (3 - Math.sqrt(5));

  /* Geometry is rebuilt whenever the device tier changes, so a window that
     starts narrow and is later maximised earns the full budget instead of
     staying on the phone geometry for the life of the page. */
  function buildGeometry() {
    pointData.length = 0;
    lineData.length = 0;

    /* Shell: fibonacci sphere, so the core reads as a structured lattice
       rather than noise. */
    for (var i = 0; i < config.shell; i++) {
      var y = 1 - (i / Math.max(config.shell - 1, 1)) * 2;
      var radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      var theta = golden * i;
      var dir = [Math.cos(theta) * radiusAtY, y, Math.sin(theta) * radiusAtY];
      var color = mixColor(PALETTE.shellFar, PALETTE.shellNear, (y + 1) * 0.5);

      pushVertex(
        pointData,
        dir,
        [0, 0, 0],
        [0, 0.98, Math.random() * 6.2831853, 0],
        [color[0], color[1], color[2], 1.5 + Math.random() * 1.9]
      );
    }

    /* Streams: four orbital flows. Density is weighted toward the head of each
       arc so the eye reads the direction of travel. */
    var ringCount = Math.min(config.rings, 4);
    var perRing = Math.floor(config.stream / Math.max(ringCount, 1));

    for (var r = 0; r < ringCount; r++) {
      var basis = bases[r];
      var tint = RING_TINTS[r];

      for (var s = 0; s < perRing; s++) {
        var progress = s / Math.max(perRing - 1, 1);

        pushVertex(
          pointData,
          basis.u,
          basis.v,
          [
            1,
            RING_RADII[r] + (Math.random() - 0.5) * 0.035,
            Math.pow(progress, 1.55) * 6.2831853,
            RING_SPEEDS[r]
          ],
          [tint[0], tint[1], tint[2], 2.0 + Math.random() * 2.2]
        );
      }
    }

    /* Ambient field: sparse depth cue around the core. */
    for (var f = 0; f < config.field; f++) {
      var fr = 2.3 + Math.random() * 2.6;
      var fTheta = Math.random() * 6.2831853;
      var fPhi = Math.acos(2 * Math.random() - 1);

      pushVertex(
        pointData,
        [
          fr * Math.sin(fPhi) * Math.cos(fTheta),
          fr * Math.cos(fPhi) * 0.55,
          fr * Math.sin(fPhi) * Math.sin(fTheta)
        ],
        [0, 0, 0],
        [2, 0, Math.random() * 6.2831853, 0],
        [
          PALETTE.shellNear[0],
          PALETTE.shellNear[1],
          PALETTE.shellNear[2],
          1.4 + Math.random()
        ]
      );
    }

    /* Orbit lines: the visible paths the streams travel along. */
    for (var lr = 0; lr < ringCount; lr++) {
      var lineBasis = bases[lr];
      var lineTint = RING_TINTS[lr];
      var segments = config.ringSegments;
      var radius = RING_RADII[lr];

      for (var seg = 0; seg < segments; seg++) {
        var a0 = (seg / segments) * 6.2831853;
        var a1 = ((seg + 1) / segments) * 6.2831853;
        var fade = 0.1 + 0.22 * Math.pow(Math.sin(a0 * 0.5), 2);

        for (var e = 0; e < 2; e++) {
          var angle = e === 0 ? a0 : a1;
          var cosA = Math.cos(angle);
          var sinA = Math.sin(angle);

          pushVertex(
            lineData,
            [
              radius * (cosA * lineBasis.u[0] + sinA * lineBasis.v[0]),
              radius * (cosA * lineBasis.u[1] + sinA * lineBasis.v[1]),
              radius * (cosA * lineBasis.u[2] + sinA * lineBasis.v[2])
            ],
            [0, 0, 0],
            [3, 0, 0, 0],
            [lineTint[0] * fade, lineTint[1] * fade, lineTint[2] * fade, 1]
          );
        }
      }
    }
  }

  var pointCount = 0;
  var lineCount = 0;

  var pointBuffer = gl.createBuffer();
  var lineBuffer = gl.createBuffer();

  function uploadGeometry() {
    buildGeometry();

    var pointArray = new Float32Array(pointData);
    var lineArray = new Float32Array(lineData);
    pointCount = pointArray.length / STRIDE;
    lineCount = lineArray.length / STRIDE;

    pointData.length = 0;
    lineData.length = 0;

    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, pointArray, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, lineArray, gl.STATIC_DRAW);
  }

  uploadGeometry();

  function bindAttributes(buffer) {
    var bytes = STRIDE * 4;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.enableVertexAttribArray(attribs.p0);
    gl.vertexAttribPointer(attribs.p0, 3, gl.FLOAT, false, bytes, 0);

    gl.enableVertexAttribArray(attribs.p1);
    gl.vertexAttribPointer(attribs.p1, 3, gl.FLOAT, false, bytes, 12);

    gl.enableVertexAttribArray(attribs.params);
    gl.vertexAttribPointer(attribs.params, 4, gl.FLOAT, false, bytes, 24);

    gl.enableVertexAttribArray(attribs.style);
    gl.vertexAttribPointer(attribs.style, 4, gl.FLOAT, false, bytes, 40);
  }

  /* --------------------------------------------------------------- matrices */

  function identity() {
    return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }

  function perspective(out, fovy, aspect, near, far) {
    var f = 1 / Math.tan(fovy / 2);

    out[0] = f / aspect; out[1] = 0; out[2] = 0; out[3] = 0;
    out[4] = 0; out[5] = f; out[6] = 0; out[7] = 0;
    out[8] = 0; out[9] = 0; out[10] = (far + near) / (near - far); out[11] = -1;
    out[12] = 0; out[13] = 0; out[14] = (2 * far * near) / (near - far); out[15] = 0;

    return out;
  }

  function modelMatrix(out, rotX, rotY, scale) {
    var cx = Math.cos(rotX);
    var sx = Math.sin(rotX);
    var cy = Math.cos(rotY);
    var sy = Math.sin(rotY);

    out[0] = cy * scale; out[1] = sy * sx * scale; out[2] = -sy * cx * scale; out[3] = 0;
    out[4] = 0; out[5] = cx * scale; out[6] = sx * scale; out[7] = 0;
    out[8] = sy * scale; out[9] = -cy * sx * scale; out[10] = cy * cx * scale; out[11] = 0;
    out[12] = 0; out[13] = 0; out[14] = 0; out[15] = 1;

    return out;
  }

  var projection = identity();
  var view = identity();
  var model = identity();

  /* ---------------------------------------------------------------- runtime */

  var pixelRatio = 1;
  var focal = 320;
  var pointer = { x: 0, y: 0 };
  var damped = { x: 0, y: 0 };
  var scrollDepth = 0;
  var energy = 0;
  var startTime = 0;
  var frameId = 0;
  var visible = true;
  var running = false;
  var destroyed = false;

  function resize() {
    var rect = host.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    pixelRatio = Math.min(window.devicePixelRatio || 1, config.dpr);

    var width = Math.round(rect.width);
    var height = Math.round(rect.height);

    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    gl.viewport(0, 0, canvas.width, canvas.height);

    var aspect = width / Math.max(height, 1);
    perspective(projection, (48 * Math.PI) / 180, aspect, 0.1, 24);
    focal = canvas.height * 0.5;

    /* Pull the camera back on narrow viewports so the core is never cropped. */
    var distance = aspect < 0.85 ? 5.6 : aspect < 1.35 ? 5.0 : 4.5;
    view[12] = 0;
    view[13] = aspect < 0.85 ? -0.05 : 0;
    view[14] = -distance;
  }

  function draw(elapsed) {
    energy = Math.min(1, energy + 0.018);
    damped.x += (pointer.x - damped.x) * 0.055;
    damped.y += (pointer.y - damped.y) * 0.055;

    var rotY = elapsed * 0.075 + damped.x * 0.42 + scrollDepth * 0.55;
    var rotX = damped.y * -0.28 + scrollDepth * 0.22 - 0.08;

    modelMatrix(model, rotX, rotY, 1 - scrollDepth * 0.13);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.uniformMatrix4fv(uniforms.projection, false, projection);
    gl.uniformMatrix4fv(uniforms.view, false, view);
    gl.uniformMatrix4fv(uniforms.model, false, model);
    gl.uniform1f(uniforms.time, elapsed);
    gl.uniform1f(uniforms.pixelRatio, pixelRatio);
    gl.uniform1f(uniforms.focal, focal);
    gl.uniform1f(uniforms.energy, energy * (1 - scrollDepth * 0.55));

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.disable(gl.DEPTH_TEST);

    if (lineCount) {
      gl.uniform1f(uniforms.isLine, 1);
      bindAttributes(lineBuffer);
      gl.drawArrays(gl.LINES, 0, lineCount);
    }

    gl.uniform1f(uniforms.isLine, 0);
    bindAttributes(pointBuffer);
    gl.drawArrays(gl.POINTS, 0, pointCount);
  }

  function render(now) {
    frameId = 0;
    if (destroyed) return;

    if (!startTime) startTime = now;
    draw((now - startTime) / 1000);

    if (running) schedule();
  }

  function schedule() {
    if (frameId || destroyed) return;
    frameId = window.requestAnimationFrame(render);
  }

  function start() {
    if (running || destroyed || reduceMotion) return;
    running = true;
    schedule();
  }

  function stop() {
    running = false;
    if (frameId) {
      window.cancelAnimationFrame(frameId);
      frameId = 0;
    }
  }

  function renderStaticFrame() {
    if (destroyed) return;
    energy = 1;
    draw(2.4);
  }

  /* -------------------------------------------------------------- listeners */

  var resizeFrame = 0;

  /* Re-tier on resize: a laptop docked to a large display, or a tablet turned
     to landscape, should gain detail rather than keep the budget it happened
     to load with. Geometry is only rebuilt when the tier actually changes, so
     ordinary resizing never pays for it. */
  function refreshTier() {
    var next = resolveTier();
    if (next === tier || destroyed) return false;

    tier = next;
    config = TIERS[tier];
    if (window.aquaCore) window.aquaCore.tier = tier;
    uploadGeometry();
    return true;
  }

  function requestResize() {
    if (resizeFrame) return;
    resizeFrame = window.requestAnimationFrame(function () {
      resizeFrame = 0;
      refreshTier();
      resize();
      if (!running) renderStaticFrame();
    });
  }

  var resizeObserver = null;

  if ("ResizeObserver" in window) {
    resizeObserver = new ResizeObserver(requestResize);
    resizeObserver.observe(host);
  } else {
    window.addEventListener("resize", requestResize, { passive: true });
  }

  var intersectionObserver = null;

  if ("IntersectionObserver" in window) {
    intersectionObserver = new IntersectionObserver(
      function (entries) {
        visible = entries.some(function (entry) {
          return entry.isIntersecting;
        });

        if (!visible) stop();
        else if (!document.hidden) start();
      },
      { threshold: 0 }
    );

    intersectionObserver.observe(host);
  }

  function onVisibilityChange() {
    if (document.hidden) stop();
    else if (visible) start();
  }

  document.addEventListener("visibilitychange", onVisibilityChange);

  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var pointerHost = host.parentElement || host;

  function onPointerMove(event) {
    var rect = host.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  }

  function onPointerLeave() {
    pointer.x = 0;
    pointer.y = 0;
  }

  if (finePointer && !reduceMotion) {
    pointerHost.addEventListener("pointermove", onPointerMove, { passive: true });
    pointerHost.addEventListener("pointerleave", onPointerLeave, { passive: true });
  }

  /* Scroll depth comes from the shared scheduler (js/aqua-scroll.js): the
     host position is measured when the page size changes, and each scroll
     frame is arithmetic on that and the frame's scroll position. */
  var hostTop = 0;
  var hostHeight = 0;
  var scrollSeeded = false;

  function measureHost() {
    var top = 0;
    for (var node = host; node; node = node.offsetParent) {
      top += node.offsetTop;
    }

    hostTop = top;
    hostHeight = host.offsetHeight;
  }

  function updateScrollDepth(metrics) {
    if (destroyed || (reduceMotion && scrollSeeded)) return;
    scrollSeeded = true;

    var span = hostHeight || metrics.vh;
    scrollDepth = Math.min(Math.max(-(hostTop - metrics.y) / span, 0), 1);
  }

  window.AquaScroll.add({ measure: measureHost, update: updateScrollDepth });

  function onContextLost(event) {
    event.preventDefault();
    stop();
    host.setAttribute("data-aqua-core-state", "fallback");
  }

  canvas.addEventListener("webglcontextlost", onContextLost, false);

  /* --------------------------------------------------------------- teardown */

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    stop();

    if (resizeObserver) resizeObserver.disconnect();
    else window.removeEventListener("resize", requestResize);

    if (intersectionObserver) intersectionObserver.disconnect();

    document.removeEventListener("visibilitychange", onVisibilityChange);
    canvas.removeEventListener("webglcontextlost", onContextLost);

    if (finePointer) {
      pointerHost.removeEventListener("pointermove", onPointerMove);
      pointerHost.removeEventListener("pointerleave", onPointerLeave);
    }

    gl.deleteBuffer(pointBuffer);
    gl.deleteBuffer(lineBuffer);
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    var lose = gl.getExtension("WEBGL_lose_context");
    if (lose) lose.loseContext();

    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
  }

  window.addEventListener("pagehide", destroy);
  window.aquaCore = { destroy: destroy, tier: tier };

  /* ------------------------------------------------------------------- boot */

  resize();

  if (reduceMotion) {
    /* Still render the core, just frozen: full visual value, zero motion. */
    renderStaticFrame();
  } else {
    start();
  }
});
