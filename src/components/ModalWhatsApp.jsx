import { motion } from "framer-motion";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function ModalWhatsApp({
  cart,
  cartTotal,
  clienteNombre,
  metodoPago,
  obtenerLinkWhatsApp,
  setMostrarBotonWhatsApp,
  setMostrarModalResena,
  setToast
}) {
  const handleConfirmClick = () => {
    const pedido = {
      carrito: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total: cartTotal,
      cliente: clienteNombre,
      metodo: metodoPago,
      fecha: Timestamp.fromDate(new Date()),
      estado: "en proceso"
    };

    addDoc(collection(db, "pedidos"), pedido)
      .then(() => {
        setToast("Pedido confirmado 🎉");
        setMostrarBotonWhatsApp(false);
        setMostrarModalResena(true);
      })
      .catch((error) => {
        console.error("Error al guardar el pedido:", error);
        setToast("Error al confirmar el pedido");
      });
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-yellow-950/35 flex items-center justify-center">
      <div className="bg-amber-100 rounded-xl pt-12 px-6 pb-6 w-11/12 max-w-md text-center shadow-lg relative">

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleConfirmClick}
          className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-800 transition"
        >
          X
        </motion.button>

        <h2 className="text-3xl font-bold text-orange-950 mb-1 lg:mb-2">¡Ya casi!</h2> 

        <div className="bg-[#fff8de] border-2 border-yellow-900 rounded-lg px-4 py-3 my-4 shadow-sm text-left">
          <p className="text-orange-950 text-lg mb-1">Transferí al siguiente alias:</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText("biteme.vcp");
              setToast("Alias copiado 📋");
            }}
            className="text-2xl font-bold text-yellow-900 tracking-wide hover:underline focus:outline-none"
            title="Copiar alias"
          >
            biteme.vcp
          </button>
          <p className="text-orange-950 text-base mt-2">
            Titular: <span className="font-semibold">Olivia Iturrusgarai Ballés</span>
          </p>
        </div>

        <p className="text-base text-orange-950 mb-1 lg:mb-2">
          y envianos el comprobante por whatsapp!
        </p>

        <div className="flex items-center justify-center">
          <a
            href={obtenerLinkWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleConfirmClick}
          >
            <img className="h-12 sm:h-14" src="/img/whatsapp.png" alt="WhatsApp" />
          </a>
        </div>
      </div>
    </div>
  );
}
