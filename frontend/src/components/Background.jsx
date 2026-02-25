export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-200/30 rounded-full blur-[100px] mix-blend-multiply" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[100px] mix-blend-multiply" />
    </div>
  );
}
