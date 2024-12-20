import { FC } from "react";

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const InputField: FC<IProps> = ({ className = "", type = "text", ...props }) => {
  return (
    <input
      type={type}
      className={`text-black rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none ${className}`}
      {...props}
    />
  );
};

export default InputField;
