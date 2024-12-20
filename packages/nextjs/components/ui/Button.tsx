import { FC } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
}

const Button: FC<ButtonProps> = ({
  isLoading = false,
  loadingText = "Загрузка...",
  children,
  className = "",
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`py-2 px-4 rounded-lg text-white ${
        isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
      } ${className}`}
      {...props}
    >
      {isLoading ? loadingText : children}
    </button>
  );
};

export default Button;
