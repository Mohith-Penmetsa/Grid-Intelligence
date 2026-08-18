"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import * as THREE from "three";
import {
  CAMERA_KEYFRAMES,
  SCROLL_HEIGHT_VH,
} from "@/lib/landing/scene-config";
import { ANIMATION_CONFIG } from "@/lib/landing/animation-config";
import type { SceneState } from "./SceneCanvas";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─── Types ────────────────────────────────────────────────────

interface ScrollControllerProps {
  containerNode: HTMLDivElement | null;
  sceneStateRef: React.RefObject<SceneState>;
  onProgressChange?: (progress: number) => void;
}

// ─── ScrollController ─────────────────────────────────────────
// Master GSAP timeline drives the full continuous 3D transformation story.
// The proxy object holds every numeric value that is tweened; syncState()
// writes them into sceneStateRef every tick so R3F components see them.

export function ScrollController({
  containerNode,
  sceneStateRef,
  onProgressChange,
}: ScrollControllerProps) {

  // ── Flat proxy: every tween-able value lives here ──────────
  const proxy = useRef({
    // camera
    camPosX: CAMERA_KEYFRAMES.intro.position[0],
    camPosY: CAMERA_KEYFRAMES.intro.position[1],
    camPosZ: CAMERA_KEYFRAMES.intro.position[2],
    camLookX: CAMERA_KEYFRAMES.intro.target[0],
    camLookY: CAMERA_KEYFRAMES.intro.target[1],
    camLookZ: CAMERA_KEYFRAMES.intro.target[2],
    // 3D object transforms
    feederIntensity: 0.3,
    transformerScatter: 0,      // non-target transformers push outward
    transformerFocusScale: 0,   // target transformer scales up/centers
    nonTargetOpacity: 1,        // non-target fade
    nonTargetScale: 1,          // non-target scale
    connectionOpacity: 0,
    powerFlowIntensity: 0,
    consumerReveal: 0,          // consumer nodes appear
    consumerSeparation: 0,      // highlight consumers spread apart
    highlightConsumerScale: 1,  // pulse scale
    transformerExplode: 0,
    priorityTrajectory: 0,
    anomalyState: 0,
    c014Focus: 0,
  });

  const syncState = useCallback(() => {
    const p = proxy.current;
    const s = sceneStateRef.current;
    if (!s) return;
    s.cameraTarget = {
      position: new THREE.Vector3(p.camPosX, p.camPosY, p.camPosZ),
      lookAt: new THREE.Vector3(p.camLookX, p.camLookY, p.camLookZ),
    };
    s.feederIntensity        = p.feederIntensity;
    s.transformerScatter     = p.transformerScatter;
    s.transformerFocusScale  = p.transformerFocusScale;
    s.nonTargetOpacity       = p.nonTargetOpacity;
    s.nonTargetScale         = p.nonTargetScale;
    s.connectionOpacity      = p.connectionOpacity;
    s.powerFlowIntensity     = p.powerFlowIntensity;
    s.consumerReveal         = p.consumerReveal;
    s.consumerSeparation     = p.consumerSeparation;
    s.highlightConsumerScale = p.highlightConsumerScale;
    s.transformerExplode     = p.transformerExplode;
    s.priorityTrajectory     = p.priorityTrajectory;
    s.anomalyState           = p.anomalyState;
    s.c014Focus              = p.c014Focus;
    onProgressChange?.(p.camPosX); // cheap trigger
  }, [sceneStateRef, onProgressChange]);

  // Helper: tween camera to keyframe inside tl
  function moveCam(
    tl: gsap.core.Timeline,
    key: keyof typeof CAMERA_KEYFRAMES,
    dur: number,
    at: string,
    ease: string = ANIMATION_CONFIG.ease.cameraMove
  ) {
    const kf = CAMERA_KEYFRAMES[key];
    tl.to(proxy.current, {
      camPosX: kf.position[0], camPosY: kf.position[1], camPosZ: kf.position[2],
      camLookX: kf.target[0],  camLookY: kf.target[1],  camLookZ: kf.target[2],
      duration: dur, ease, onUpdate: syncState,
    }, at);
  }

  // Helper: tween proxy values
  function tweenProxy(
    tl: gsap.core.Timeline,
    vars: Partial<typeof proxy.current> & { duration: number; ease?: string },
    at: string
  ) {
    tl.to(proxy.current, { ...vars, onUpdate: syncState }, at);
  }

  // Helper: Explicitly tween HTML overlays in and out to guarantee state across scrub/reload
  function tweenHTML(
    tl: gsap.core.Timeline,
    selector: string,
    inLabel: string,
    outLabel?: string,
    stagger?: number
  ) {
    tl.fromTo(
      selector,
      { opacity: 0, y: 20, pointerEvents: "none" },
      { opacity: 1, y: 0, pointerEvents: "auto", duration: 2, ease: ANIMATION_CONFIG.ease.textReveal, stagger, immediateRender: false },
      inLabel
    );
    if (outLabel) {
      tl.fromTo(
        selector,
        { opacity: 1, y: 0, pointerEvents: "auto" },
        { opacity: 0, y: -20, pointerEvents: "none", duration: 2, ease: "power2.inOut", stagger: stagger ? stagger * 0.5 : undefined, immediateRender: false },
        outLabel
      );
    }
  }

  const T = ANIMATION_CONFIG.timelineTotal; // 100

  useGSAP(() => {
    if (!containerNode) return;

    // Ensure ScrollTrigger uses the document scroller (not a nested element)
    ScrollTrigger.defaults({ scroller: window });

    // ─── Intro auto-play (runs once on page load, not scroll-driven) ───
    const introAuto = gsap.timeline();
    introAuto.fromTo("[data-scene-id='intro-title']",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.8, ease: ANIMATION_CONFIG.ease.textReveal },
      ANIMATION_CONFIG.intro.titleRevealDelay
    );
    introAuto.fromTo("[data-scene-id='intro-subtitle']",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.5, ease: ANIMATION_CONFIG.ease.textReveal },
      ANIMATION_CONFIG.intro.subtitleDelay
    );
    introAuto.fromTo("[data-scene-id='intro-desc']",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.5, ease: ANIMATION_CONFIG.ease.textReveal },
      ANIMATION_CONFIG.intro.subtitleDelay + 0.4
    );

    // ── Master timeline pinned to the cinematic container ──────

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerNode,
        start: "top top",
        // 700vh expressed as pixel offset — unambiguous across browsers
        end: () => `+=${window.innerHeight * (SCROLL_HEIGHT_VH / 100)}`,
        scrub: ANIMATION_CONFIG.scrubLag,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        onUpdate(self) {
          if (self.progress > 0.02 && introAuto.isActive()) {
            introAuto.progress(1);
            introAuto.kill();
          }
          syncState();
          onProgressChange?.(self.progress);
        },
      },
    });

    // ════════════════════════════════════════════════════════════
    // SCENE 1 — HERO  (0 → 10)
    // ════════════════════════════════════════════════════════════
    tl.addLabel("hero", 0);
    tweenProxy(tl, { feederIntensity: 1.4, duration: 4, ease: "power2.inOut" }, "hero");
    
    // ════════════════════════════════════════════════════════════
    // SCENE 2 — DISTRIBUTION NETWORK  (10 → 25)
    // ════════════════════════════════════════════════════════════
    tl.addLabel("network", T * 0.10);
    
    // Fade hero text
    tl.fromTo(
      "[data-scene-id='intro-title'],[data-scene-id='intro-subtitle'],[data-scene-id='intro-desc']",
      { opacity: 1, y: 0 },
      { opacity: 0, y: -20, duration: 2, ease: "power3.inOut", immediateRender: false },
      "network"
    );

    tweenProxy(tl, { connectionOpacity: 0.5, powerFlowIntensity: 1.0, duration: 6, ease: "power2.inOut" }, "network");
    moveCam(tl, "network", 8, "network", "power2.inOut");
    tweenHTML(tl, "[data-scene-id='network-text']", "network+=4", "transformer+=2");

    // ════════════════════════════════════════════════════════════
    // SCENE 3 — TRANSFORMER ANALYSIS  (25 → 40)
    // ════════════════════════════════════════════════════════════
    tl.addLabel("transformer", T * 0.25);

    tweenProxy(tl, { transformerScatter: 1, transformerFocusScale: 1, duration: 6, ease: "power2.inOut" }, "transformer");
    tweenProxy(tl, { nonTargetOpacity: 0.15, nonTargetScale: 0.55, duration: 5, ease: "power2.inOut" }, "transformer");
    tweenProxy(tl, { connectionOpacity: 0.12, powerFlowIntensity: 0.35, duration: 4, ease: "power2.inOut" }, "transformer");
    
    moveCam(tl, "transformer", 8, "transformer", "power2.inOut");

    tweenHTML(tl, "[data-scene-id='transformer-text']", "transformer+=4", "loss+=2");
    tweenHTML(tl, "[data-scene-id='data-panel']", "transformer+=4.5", "loss+=2");
    tweenHTML(tl, "[data-scene-id^='data-row-']", "transformer+=5", "loss+=2", 0.4);
    tl.fromTo("[data-scene-id='loss-bar']", { scaleX: 0 }, { scaleX: 1, duration: 2, ease: "back.out(1.2)", immediateRender: false }, "transformer+=7");
    // Explicitly hide loss-bar at the end
    tl.to("[data-scene-id='loss-bar']", { scaleX: 0, opacity: 0, duration: 2, ease: "power2.inOut", immediateRender: false }, "loss+=2");

    // ════════════════════════════════════════════════════════════
    // SCENE 4 — COMMERCIAL LOSS  (40 → 55)
    // ════════════════════════════════════════════════════════════
    tl.addLabel("loss", T * 0.40);
    
    tweenProxy(tl, { transformerExplode: 1, duration: 5, ease: "power2.inOut" }, "loss");
    moveCam(tl, "loss", 8, "loss", "power2.inOut");
    tweenHTML(tl, "[data-scene-id='loss-text']", "loss+=4", "risk+=2");

    // ════════════════════════════════════════════════════════════
    // SCENE 5 — RISK RANKING  (55 → 70)
    // ════════════════════════════════════════════════════════════
    tl.addLabel("risk", T * 0.55);

    tweenProxy(tl, { anomalyState: 1, transformerExplode: 0, transformerScatter: 0, transformerFocusScale: 0, duration: 6, ease: "power2.inOut" }, "risk");
    tweenProxy(tl, { nonTargetOpacity: 0.7, nonTargetScale: 0.9, duration: 5, ease: "power2.inOut" }, "risk");
    tweenProxy(tl, { connectionOpacity: 0.35, powerFlowIntensity: 0.8, duration: 5, ease: "power2.inOut" }, "risk");
    
    moveCam(tl, "risk", 8, "risk", "power2.inOut");

    tweenHTML(tl, "[data-scene-id='risk-text']", "risk+=4", "consumer+=2");
    tweenHTML(tl, "[data-scene-id='transformer-risk-grid']", "risk+=4.5", "consumer+=2");
    tweenHTML(tl, "[data-scene-id^='tr-risk-']", "risk+=5", "consumer+=2", 0.3);

    // ════════════════════════════════════════════════════════════
    // SCENE 6 — CONSUMER ANALYSIS  (70 → 85)
    // ════════════════════════════════════════════════════════════
    tl.addLabel("consumer", T * 0.70);

    tweenProxy(tl, { transformerScatter: 0.7, transformerFocusScale: 0.7, consumerReveal: 1, duration: 6, ease: "power2.inOut" }, "consumer");
    tweenProxy(tl, { nonTargetOpacity: 0.08, nonTargetScale: 0.4, duration: 5, ease: "power2.inOut" }, "consumer");
    tweenProxy(tl, { connectionOpacity: 0.08, powerFlowIntensity: 0.2, duration: 4, ease: "power2.inOut" }, "consumer");
    
    // Spread priority consumers outwards and isolate C014
    tweenProxy(tl, { consumerSeparation: 1, priorityTrajectory: 1, highlightConsumerScale: 1.5, c014Focus: 1, duration: 6, ease: "power2.inOut" }, "consumer+=2");

    moveCam(tl, "consumer", 8, "consumer", "power2.inOut");

    tweenHTML(tl, "[data-scene-id='consumer-text']", "consumer+=4", "action+=1.5");
    tweenHTML(tl, "[data-scene-id='priority-panel']", "consumer+=4.5", "action+=1.5");
    tweenHTML(tl, "[data-scene-id^='priority-row-']", "consumer+=5", "action+=1.5", 0.3);

    // ════════════════════════════════════════════════════════════
    // SCENE 7 — INSPECTION RECOMMENDATION (85 → 97)
    // ════════════════════════════════════════════════════════════
    tl.addLabel("action", T * 0.85);
    
    moveCam(tl, "action", 8, "action", "power2.inOut");

    tweenHTML(tl, "[data-scene-id='inspection-text']", "action+=3.5", "action2+=1"); // Text leaves just as action2 settles
    tweenHTML(tl, "[data-scene-id='inspection-card']", "action+=3.5", "action2+=1");

    // ════════════════════════════════════════════════════════════
    // SCENE 8 — FINAL ACTION / CLOSING  (97 → 115)
    // Subtle camera push. Closing quote + CTA.
    // ════════════════════════════════════════════════════════════
    tl.addLabel("action2", T * 0.97);
    
    // Dim the cyan network flow by ~50% to push it into the background and support the text
    tweenProxy(tl, { connectionOpacity: 0.04, powerFlowIntensity: 0.1, consumerReveal: 0.5, priorityTrajectory: 0.4, duration: 6, ease: "power2.inOut" }, "action2");
    
    moveCam(tl, "action2", 8, "action2", "power2.out"); // Slower, calmer easing for the conclusion

    tweenHTML(tl, "[data-scene-id='closing-quote']", "action2+=1");
    tweenHTML(tl, "[data-scene-id='closedloop-cta']", "action2+=2");

    // Add empty pad at the end of timeline so animations complete before bottoming out
    tl.to({}, { duration: 6 });

    // Refresh ScrollTrigger after layout settles
    ScrollTrigger.refresh();
    syncState();

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, { scope: containerNode ? { current: containerNode } : undefined, dependencies: [containerNode] });

  return null;
}

