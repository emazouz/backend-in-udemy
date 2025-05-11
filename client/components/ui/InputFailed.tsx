interface IInputFailed {
  title: string;
  label: string;
  type: string;
  value: any;
  action: any;
}

export default function InputFailed({
  title,
  label,
  type,
  value,
  action,
}: IInputFailed) {
  return (
    <div className="mb-3">
      <label
        className="block text-gray-800 text-sm font-semibold mb-1"
        htmlFor={label}
      >
        {title}
      </label>
      <input
        className="shadow-md appearance-none border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        id={label}
        type={type}
        placeholder={`Enter your ${label}`}
        value={value}
        onChange={action}
        required
      />
      <p className="text-sm text-red-500 mt-1 hidden" id={`${label}-error`}>
        This field is required.
      </p>
    </div>
  );
}
