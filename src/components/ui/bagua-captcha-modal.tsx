import { useState, useEffect, useCallback } from "react";

interface Trigram {
  name: string;
  symbol: string;
  meaning: string;
  index: number;
}

interface CaptchaData {
  token: string;
  targetTrigram: {
    name: string;
    symbol: string;
    meaning: string;
  };
  trigrams: Trigram[];
}

interface BaguaCaptchaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (token: string) => void;
}

export function BaguaCaptchaModal({ isOpen, onClose, onVerified }: BaguaCaptchaModalProps) {
  const [captchaData, setCaptchaData] = useState<CaptchaData | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const loadCaptcha = useCallback(async () => {
    try {
      const response = await fetch("/api/captcha/bagua");
      const data = await response.json();
      setCaptchaData(data);
      setSelectedIndex(null);
      setErrorMessage("");
      setSuccess(false);
    } catch (error) {
      console.error("Failed to load captcha:", error);
      setErrorMessage("加载验证码失败，请重试");
    }
  }, []);

  useEffect(() => {
    if (isOpen && !captchaData) {
      loadCaptcha();
    }
  }, [isOpen, captchaData, loadCaptcha]);

  const handleSelect = async (index: number) => {
    if (!captchaData || isVerifying || selectedIndex !== null) return;

    setSelectedIndex(index);
    setIsVerifying(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/captcha/bagua", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: captchaData.token,
          selectedIndex: index,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onVerified(captchaData.token);
          onClose();
        }, 800);
      } else {
        setErrorMessage(result.message);
        setTimeout(() => {
          setSelectedIndex(null);
          loadCaptcha();
        }, 1000);
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setErrorMessage("验证失败，请重试");
      setTimeout(() => {
        setSelectedIndex(null);
      }, 1000);
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[linear-gradient(145deg,rgba(18,18,18,0.98),rgba(9,9,9,0.95))] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.5)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,rgba(199,177,136,0.15),transparent_60%)]" />
        
        <div className="relative">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-white mb-2">卦象验证</h3>
            <p className="text-sm text-[#d3cdc3]">请在下方点击正确的卦象以继续</p>
          </div>

          {captchaData && (
            <div className="mb-6 text-center">
              <p className="text-sm text-[#d3cdc3] mb-3">请点击卦象：</p>
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full border border-[#c7b188]/30 bg-[#c7b188]/10">
                <span className="text-3xl">{captchaData.targetTrigram.symbol}</span>
                <div className="text-left">
                  <div className="text-lg font-medium text-[#c7b188]">{captchaData.targetTrigram.name}</div>
                  <div className="text-xs text-[#888]">{captchaData.targetTrigram.meaning}</div>
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 text-center text-sm text-red-400 animate-pulse">
              {errorMessage}
            </div>
          )}

          {captchaData && (
            <div className="grid grid-cols-4 gap-3 mb-6">
              {captchaData.trigrams.map((trigram, index) => {
                const isSelected = selectedIndex === index;
                const isSuccessState = success && isSelected;

                return (
                  <button
                    key={index}
                    onClick={() => handleSelect(index)}
                    disabled={selectedIndex !== null || isVerifying}
                    className={`
                      relative flex flex-col items-center gap-1 p-3 rounded-xl border
                      transition-all duration-300 ease-out
                      ${isSelected
                        ? isSuccessState
                          ? "border-green-500 bg-green-500/20 scale-105"
                          : "border-red-500 bg-red-500/20 shake"
                        : "border-white/10 bg-white/5 hover:border-[#c7b188]/50 hover:bg-[#c7b188]/10 hover:scale-105"
                      }
                      ${selectedIndex !== null && !isSelected ? "opacity-50" : ""}
                      ${isVerifying ? "cursor-wait" : "cursor-pointer"}
                    `}
                  >
                    <span className="text-2xl text-[#c7b188]">{trigram.symbol}</span>
                    <span className="text-xs text-[#d3cdc3]">{trigram.name}</span>
                    <span className="text-xs text-[#888]">{trigram.meaning}</span>
                    
                    {isSelected && (
                      <div className={`absolute inset-0 flex items-center justify-center rounded-xl ${
                        isSuccessState ? "bg-green-500/10" : "bg-red-500/10"
                      }`}>
                        <span className={`text-xl ${
                          isSuccessState ? "text-green-500" : "text-red-500"
                        }`}>
                          {isSuccessState ? "✓" : "✗"}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-[#d3cdc3] transition hover:bg-white/10"
            >
              取消
            </button>
            <button
              onClick={loadCaptcha}
              disabled={isVerifying}
              className="flex-1 rounded-xl border border-[#c7b188]/20 bg-[#c7b188]/10 px-4 py-3 text-sm font-medium text-[#c7b188] transition hover:bg-[#c7b188]/20"
            >
              换一组
            </button>
          </div>
        </div>

        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            75% { transform: translateX(4px); }
          }
          .shake {
            animation: shake 0.3s ease-in-out;
          }
        `}</style>
      </div>
    </div>
  );
}
