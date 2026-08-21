export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/2347061302674"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center"
    >
      {/* Pulsing ring — subtle, slow, draws the eye without being obnoxious */}
      <span
        aria-hidden
        className="whatsapp-pulse absolute inset-0 rounded-full bg-[#25D366]"
      />
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform group-hover:scale-110 group-hover:shadow-xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="h-7 w-7 fill-white"
        >
          <path d="M16.001 3C9.373 3 4 8.373 4 15.001c0 2.362.652 4.57 1.786 6.457L4 29l7.72-1.749A11.94 11.94 0 0016.001 27C22.629 27 28 21.627 28 15.001 28 8.373 22.629 3 16.001 3zm0 21.818a9.78 9.78 0 01-5.03-1.38l-.361-.214-4.583 1.038 1.06-4.47-.236-.372a9.79 9.79 0 01-1.517-5.219c0-5.428 4.417-9.845 9.845-9.845 5.428 0 9.845 4.417 9.845 9.845 0 5.428-4.417 9.845-9.845 9.845z" />
          <path d="M21.472 18.02c-.297-.148-1.758-.868-2.03-.967-.273-.099-.472-.148-.67.148-.198.297-.769.967-.943 1.166-.173.198-.347.223-.644.075-.297-.148-1.254-.462-2.388-1.472-.883-.788-1.48-1.761-1.653-2.058-.173-.297-.019-.458.13-.606.133-.132.297-.347.446-.52.148-.174.198-.298.297-.496.099-.198.05-.372-.025-.52-.074-.148-.669-1.613-.917-2.21-.242-.58-.487-.502-.669-.512l-.57-.01c-.198 0-.52.074-.792.372-.273.297-1.04 1.017-1.04 2.48 0 1.463 1.065 2.877 1.213 3.075.148.198 2.096 3.2 5.077 4.488.709.306 1.262.489 1.693.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        </svg>
      </span>
    </a>
  );
}