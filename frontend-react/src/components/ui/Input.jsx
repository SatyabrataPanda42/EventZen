export default function Input({
  label,
  type = "text",
  value,
  onChange,
  defaultValue,
  placeholder,
  required = false,
  name,
  children,
}) {
  return (
    <div className="space-y-1.5 w-full text-left">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      {type === "select" ? (
        <select
          name={name}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          required={required}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          {children}
        </select>
      ) : type === "textarea" ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={3}
          className="w-full px-4 py-2 rounded-lg border border-gray-300"
        />
      ) : (
        <input
          type={type}
          name={name}
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full px-4 py-2 rounded-lg border border-gray-300"
        />
      )}
    </div>
  );
}
