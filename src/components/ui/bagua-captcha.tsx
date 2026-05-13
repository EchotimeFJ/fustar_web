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

interface BaguaCaptchaProps {
  onValidated: (token: string) => void;
}

export function BaguaCaptcha({ onValidated }: BaguaCaptchaProps) {
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
      setErrorMessage("加载验证码失败，请刷新页面");
    }
  }, []);

  useEffect(() => {
    loadCaptcha();
  }, [loadCaptcha]);

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
          onValidated(captchaData.token);
        }, 500);
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

  if (!captchaData) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-2 border-[#c7b188]/30 border-t-[#c7b188] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-[#d3cdc3] mb-2">请点击以下卦象完成验证</p>
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#c7b188]/30 bg-[#c7b188]/10">
          <span className="text-2xl">{captchaData.targetTrigram.symbol}</span>
          <span className="text-lg font-medium text-[#c7b188]">{captchaData.targetTrigram.name}</span>
          <span className="text-sm text-[#d3cdc3]">({captchaData.targetTrigram.meaning})</span>
        </div>
      </div>

      {errorMessage && (
        <div className="text-center text-sm text-red-400 animate-pulse">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-4 gap-3">
        {captchaData.trigrams.map((trigram, index) => {
          const isSelected = selectedIndex === index;
          const isSuccessState = success && isSelected;

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={selectedIndex !== null || isVerifying}
              className={`
                relative flex flex-col items-center gap-1 p-4 rounded-xl border
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

      <div className="text-center">
        <button
          onClick={loadCaptcha}
          disabled={isVerifying}
          className="text-xs text-[#c7b188]/70 hover:text-[#c7b188] transition-colors"
        >
          换一组卦象
        </button>
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
  );
}