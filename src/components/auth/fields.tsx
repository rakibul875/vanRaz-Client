import {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  useState,
} from "react";

export function Field({
  label,
  htmlFor,
  rightSlot,
  ...rest
}: {
  label: string;
  htmlFor: string;
  rightSlot?: ReactNode;
} & LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium text-[#2A2E2B]"
          {...rest}
        >
          {label}
        </label>
        {rightSlot}
      </div>
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "w-full rounded-lg border border-[#DEDACE] bg-white px-4 py-3 text-[15px] text-[#14181B] outline-none transition placeholder:text-[#A6A196] focus:border-[#C08A3E] focus:ring-4 focus:ring-[#C08A3E]/15 " +
        (props.className ?? "")
      }
    />
  );
}

export function PasswordInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={
          "w-full rounded-lg border border-[#DEDACE] bg-white px-4 py-3 pr-12 text-[15px] text-[#14181B] outline-none transition placeholder:text-[#A6A196] focus:border-[#C08A3E] focus:ring-4 focus:ring-[#C08A3E]/15 " +
          (props.className ?? "")
        }
      />
      <button
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        title={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#8A8578] transition hover:text-[#0E1B1B] focus:outline-none focus:text-[#0E1B1B]"
      >
        {visible ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
            <line x1="2" x2="22" y1="2" y2="22" />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}

export function PrimaryButton({
  loading,
  loadingText,
  children,
  ...rest
}: {
  loading?: boolean;
  loadingText?: string;
  children: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      disabled={loading || rest.disabled}
      className="w-full rounded-lg bg-[#0E1B1B] px-4 py-3 text-[15px] font-medium text-[#FBFAF7] transition hover:bg-[#16302E] focus:outline-none focus:ring-4 focus:ring-[#0E1B1B]/15 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? loadingText ?? "Please wait…" : children}
    </button>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="mb-5 rounded-lg border border-[#E3B9A6] bg-[#FBEEE8] px-4 py-3 text-sm text-[#9B4A2D]"
    >
      {message}
    </div>
  );
}