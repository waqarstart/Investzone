import { Camera, Check, Loader2, ScanFace } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { wait } from "@/lib/documents";
import { useKycDraft } from "../useKycDraft";
import { FileDropzone } from "./FileDropZone";

type Phase =
  | "idle"
  | "requesting"
  | "live"
  | "denied"
  | "liveness"
  | "ready"
  | "matching"
  | "matched";

const PROMPTS = ["Look straight at the camera", "Blink", "Turn your head slightly"];
const LIVENESS_MS = 6000;
const RING = 2 * Math.PI * 46;

export function SelfieStep() {
  const selfie = useKycDraft((state) => state.selfie);
  const setSelfie = useKycDraft((state) => state.setSelfie);

  const [phase, setPhase] = useState<Phase>(selfie === "matched" ? "matched" : "idle");
  const [progress, setProgress] = useState(0);
  const [still, setStill] = useState<string | null>(null);
  const [fallbackFile, setFallbackFile] = useState<File | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  useEffect(
    () => () => {
      stopCamera();
      if (timerRef.current) window.clearInterval(timerRef.current);
    },
    [stopCamera],
  );

  useEffect(() => {
    const video = videoRef.current;
    const stream = streamRef.current;
    if (video && stream && video.srcObject !== stream) {
      video.srcObject = stream;
      void video.play().catch(() => undefined);
    }
  }, [phase]);

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setPhase("denied");
      return;
    }
    setPhase("requesting");
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      setPhase("live");
    } catch {
      setPhase("denied");
    }
  };

  const startLiveness = () => {
    setPhase("liveness");
    setProgress(0);
    const start = performance.now();
    timerRef.current = window.setInterval(() => {
      const value = Math.min((performance.now() - start) / LIVENESS_MS, 1);
      setProgress(value);
      if (value >= 1) {
        if (timerRef.current) window.clearInterval(timerRef.current);
        setPhase("ready");
      }
    }, 100);
  };

  const runMatch = async () => {
    setPhase("matching");
    await wait(1500);
    setSelfie("matched");
    setPhase("matched");
  };

  const capture = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    setStill(canvas.toDataURL("image/jpeg", 0.85));
    stopCamera();
    void runMatch();
  };

  const retake = () => {
    stopCamera();
    setStill(null);
    setFallbackFile(null);
    setProgress(0);
    setSelfie("none");
    setPhase("idle");
  };

  const showVideo = phase === "live" || phase === "liveness" || phase === "ready";
  const promptIndex = Math.min(PROMPTS.length - 1, Math.floor(progress * PROMPTS.length));

  return (
    <div className="grid gap-5">
      <div className="relative mx-auto aspect-[4/5] w-full max-w-[560px] overflow-hidden rounded-2xl bg-[#14213D] sm:aspect-[4/3]">
        {showVideo && (
          <video ref={videoRef} playsInline muted className="size-full -scale-x-100 object-cover" />
        )}
        {still && <img src={still} alt="Your captured selfie" className="size-full -scale-x-100 object-cover" />}

        {phase === "liveness" && (
          <>
            <svg viewBox="0 0 100 100" className="absolute inset-0 m-auto size-[75%]" aria-hidden="true">
              <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="#F5B544"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={RING}
                strokeDashoffset={(1 - progress) * RING}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <p
              role="status"
              className="absolute inset-x-4 bottom-4 rounded-full bg-black/60 px-4 py-2 text-center text-sm font-semibold text-white"
            >
              {PROMPTS[promptIndex]}
            </p>
          </>
        )}

        {(phase === "idle" || phase === "requesting") && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center text-white">
            <ScanFace className="size-14 text-[#F5B544]" aria-hidden="true" />
            <p className="max-w-xs text-sm text-white/80">
              Position your face in good light. We only ask for camera access when you press start.
            </p>
            <Button
              type="button"
              onClick={() => void startCamera()}
              disabled={phase === "requesting"}
              className="h-12 rounded-xl bg-[#F5B544] px-6 font-semibold text-[#14213D] hover:bg-[#E9A72F]"
            >
              {phase === "requesting" ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Camera className="mr-2 size-4" />}
              Start camera
            </Button>
          </div>
        )}

        {phase === "matching" && (
          <div
            role="status"
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#14213D]/70 text-white"
          >
            <Loader2 className="size-8 animate-spin text-[#F5B544]" />
            <p className="text-sm font-semibold">Comparing with your ID photo…</p>
          </div>
        )}

        {phase === "matched" && (
          <div
            role="status"
            className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-[#5BA4E6] px-4 py-3 text-sm font-semibold text-white"
          >
            <Check className="size-4" aria-hidden="true" />
            Face matched · Demo match score: 96%
          </div>
        )}
      </div>

      {phase === "denied" && (
        <div className="grid gap-4 rounded-2xl bg-[#FDECE8] p-4">
          <p className="text-sm font-semibold text-[#D9442F]">Camera access is unavailable</p>
          <FileDropzone
            id="selfie-upload"
            label="Upload a selfie instead"
            file={fallbackFile}
            imagesOnly
            onChange={(file) => {
              setFallbackFile(file);
              if (file) void runMatch();
            }}
          />
          <p className="text-xs text-slate-600">Liveness is skipped for uploaded photos in this demo.</p>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        {phase === "live" && (
          <Button
            type="button"
            onClick={startLiveness}
            className="h-12 rounded-xl bg-[#F5B544] px-6 font-semibold text-[#14213D] hover:bg-[#E9A72F]"
          >
            Start liveness check
          </Button>
        )}
        {(phase === "liveness" || phase === "ready") && (
          <Button
            type="button"
            onClick={capture}
            disabled={phase !== "ready"}
            className="h-12 rounded-xl bg-[#F5B544] px-6 font-semibold text-[#14213D] hover:bg-[#E9A72F]"
          >
            Capture
          </Button>
        )}
        {phase === "matched" && (
          <Button type="button" variant="outline" onClick={retake} className="h-12 rounded-xl px-6">
            Retake
          </Button>
        )}
      </div>
    </div>
  );
}