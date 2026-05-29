export default function SubscriptionOverlay() {
  return (
    <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6">

      <div className="bg-white max-w-md w-full rounded-[32px] p-8 text-center shadow-2xl">

        {/* LOGO */}
        <img
          src="https://res.cloudinary.com/djnjhphf5/image/upload/v1779814901/sodah.io_logo_z6xflv.png"
          alt="Sodah"
          className="w-20 h-20 mx-auto rounded-2xl mb-5"
        />

        {/* TITLE */}
        <h1 className="text-3xl font-black text-black mb-3">
          Subscription Expired
        </h1>

        {/* DESCRIPTION */}
        <p className="text-gray-600 mb-6 leading-7">
          Your free trial has expired.
          Please upgrade your subscription
          to continue using Sodah AI.
        </p>

        {/* BUTTON */}
        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300"
          onClick={() => {
            alert(
              "Payment integration coming next."
            );
          }}
        >
          Upgrade Subscription
        </button>

      </div>
    </div>
  );
}