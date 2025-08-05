import { useState, useEffect, useMemo } from 'react'
import Cookie from './components/Cookie'
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header'
import AccesoPedidos from "./components/AccesoPedidos";
import FormularioResena from './components/FormularioResena';
import{db as cookiesData } from './data/db'
import './App.css'
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";
import Carrito from './components/Carrito';

function App() {
  const [clienteNombre, setClienteNombre] = useState('');
  const [metodoPago, setMetodoPago] = useState('');

  const [confirmando] = useState(false);
  const [mostrarBotonWhatsApp, setMostrarBotonWhatsApp] = useState(false);
  const [mostrarModalResena, setMostrarModalResena] = useState(false);

const [isStickyCart, setIsStickyCart] = useState(false);

  useEffect(() => {
  const handleScroll = () => {
    const isMobile = window.innerWidth < 640; // sm breakpoint en Tailwind
    const scrollThreshold = isMobile ? 40 : 160; // menos scroll en móvil, más en PC
    setIsStickyCart(window.scrollY > scrollThreshold);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);




 const generarMensajeWhatsApp = () => {
  if (!cart.length || !clienteNombre.trim()) return "";

  const lineaGalletas = cart
    .map(item => `- ${item.name} x${item.quantity} = $${item.quantity * item.price}`)
    .join('\n');

  return `Hola mamuuu, soy ${clienteNombre}. Te envío el comprobante de mi pedido:\n${lineaGalletas}\nTotal: $${cartTotal}`;
};

const obtenerLinkWhatsApp = () => {
  const mensaje = generarMensajeWhatsApp();
  return `https://wa.me/5493541396868?text=${encodeURIComponent(mensaje)}`;
};


 const confirmarPedido = async () => {
  if (!cart.length || isNaN(cartTotal)) {
    setToast("Error: carrito vacío o total inválido");
    return;
  }

  if (!clienteNombre.trim()) {
    setToast("Por favor ingresá tu nombre");
    return;
  }

  if (!metodoPago) {
    setToast("Elegí un método de pago");
    return;
  }

  setMostrarModal(false);

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

  try {
    await addDoc(collection(db, "pedidos"), pedido);
    setToast("Pedido confirmado 🎉");
    setCart([]);
    setClienteNombre('');

    if (metodoPago === "efectivo") {
      // No mostrar modal de WhatsApp
      setMostrarModalResena(true);
    } else {
      // Solo mostrar botón de WhatsApp si es mercado pago
      setMostrarBotonWhatsApp(true);
    }
  } catch (error) {
    console.error("Error al guardar el pedido:", error);
    setToast("Error al confirmar el pedido");
  }
};




  const [toast, setToast] = useState('');
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
    const initialCart= () => {
      const localStorageCart= localStorage.getItem('cart')
      return localStorageCart ? JSON.parse(localStorageCart):[]
    }
  
    const[data,]=useState(cookiesData)
    const[cart,setCart]=useState(initialCart)
  
    useEffect(()=>{
      localStorage.setItem('cart',JSON.stringify(cart))
    }, [cart])
  
    const MAX_ITEMS=10
  
    function addToCart(item){
      const itemExists= cart.findIndex(cookie => cookie.id === item.id)
      if(itemExists>= 0) {//exisate en el carrito
        if(cart[itemExists].quantity>= MAX_ITEMS)return
      const updatedCart = [...cart]
      updatedCart[itemExists].quantity++
      setCart(updatedCart)
    } else {
      item.quantity=1
      setCart([...cart,item])
    }
    setToast(`${item.name} agregado al carrito`);
    saveLocalStorage()
    }
  
  function removeFromCart(id) {
    setCart(prevCart => prevCart.filter(cookie=> cookie.id !== id))
    
  }
  
  function increaseQuantity(id){
    const updatedCart=cart.map(item => {
      if(item.id===id && item.quantity < MAX_ITEMS){
        return{
          ...item,
          quantity:item.quantity + 1
        }
      }
      return item
    })
    setCart(updatedCart)
  }
  
  function decreaseQuantity(id) {
    const updatedCart = cart
      .map(item => {
        if (item.id === id) {
          if (item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return null; 
          }
        }
        return item;
      })
      .filter(item => item !== null); 
    setCart(updatedCart);
  }
  
  function clearCart(){
    setCart([])
  }
  
  function saveLocalStorage(){
    localStorage.setItem('cart', JSON.stringify(cart))
  }

  const [mostrarModal, setMostrarModal] = useState(false);

  const cartTotal = useMemo(() => {
  const totalCantidad = cart.reduce((sum, item) => sum + item.quantity, 0);
  console.log(totalCantidad)
  // Si hay exactamente 5 cookies, precio promocional
  if (totalCantidad === 5) {
    return 4000;
  }

  // Sino, calcular normalmente
  return cart.reduce((total, item) => total + item.quantity * item.price, 0);
}, [cart]);

useEffect(() => {
  document.body.style.overflow = mostrarModal ? 'hidden' : 'auto';
}, [mostrarModal]);

  return (
    <>
    <Header 
  cart={cart}
  clearCart={clearCart}
/>
<Carrito
cart={cart} 
  cartTotal={cartTotal}
  removeFromCart={removeFromCart}
  decreaseQuantity={decreaseQuantity}
  increaseQuantity={increaseQuantity}
  clearCart={clearCart}
  setMostrarModal={setMostrarModal}
  isStickyCart={isStickyCart}/>
<main className="">
  
        
      <section  className="align-items-center pt-10 lg:pt-20 pb-4 lg:pb-16 px-6">
  <div className="max-w-6xl mx-auto text-center mb-7 lg:mb-13">
    <h2 className="text-3xl md:text-5xl lg:text-7xl font-pacifico text-orange-950 mb-2 lg:mb-5">Nuestras Cookies</h2>
    <p className="text-lg lg:text-xl font-poppins text-orange-950">Elegí tu favorita y llevate 5 por $4000</p>
  </div>

  <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-3  lg:gap-y-10 lg:gap-x-8 gap-2  sm:gap-y-3 md:m-1 sm:mx-4 justify-items-center lg:mx-12">
    {data.map((cookie) => (
      <Cookie
        key={cookie.id}
        cookie={cookie}
        setCart={setCart}
        addToCart={addToCart}
      />
    ))}
  </div>
</section>

{mostrarModal && (
  <div className="fixed inset-0 z-50 backdrop-blur-sm bg-yellow-950/35 flex items-center justify-center">
    <div className="bg-amber-100 rounded-xl pt-12  px-6 pb-6 w-11/12 max-w-md text-center shadow-lg relative">
    <motion.button
  whileTap={{ scale: 0.95 }}
  onClick={() => setMostrarModal(false)}
  className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-800 transition"
>
  X
</motion.button>

     <h2 className="text-2xl font-bold text-orange-950 mb-4">
  Total a pagar: <span className="text-[#6e3712]">${cartTotal}</span>
</h2>


<input
  type="text"
  placeholder="Tu nombre"
  value={clienteNombre}
  onChange={(e) => setClienteNombre(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      confirmarPedido();
    }
  }}
  className="border border-gray-300 rounded px-3 py-2 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-[#ff95ab]"
/>
<div className="mb-4">
  <p className="text-orange-950 text-lg mb-1">Elegí tu forma de pago:</p>
  <div className="flex justify-center gap-4">
    <button
      onClick={() => setMetodoPago('mercado_pago')}
      className={`px-4 py-2 rounded-lg border-2 ${
        metodoPago === 'mercado_pago'
          ? 'bg-[#ff95ab] text-white border-[#ff95ab]'
          : 'bg-white text-orange-950 border-orange-300'
      }`}
    >
      Mercado Pago
    </button>
    <button
      onClick={() => setMetodoPago('efectivo')}
      className={`px-4 py-2 rounded-lg border-2 ${
        metodoPago === 'efectivo'
          ? 'bg-[#ff95ab] text-white border-[#ff95ab]'
          : 'bg-white text-orange-950 border-orange-300'
      }`}
    >
      Efectivo
    </button>
  </div>
</div>

<motion.button
  whileTap={{ scale: confirmando ? 1 : 0.95 }}
  onClick={confirmarPedido}
  disabled={confirmando}
  className={`${
    confirmando ? "bg-gray-400 cursor-not-allowed" : "bg-[#ffa2b5] hover:bg-[#ff95ab]"
  } text-white px-4 py-2 rounded transition w-full mt-2`}
>
  
  {confirmando ? "Confirmando..." : "Confirmar pedido"}
</motion.button>
</div>
  </div>
)}
{mostrarBotonWhatsApp && (
  <div className="fixed inset-0 z-50 backdrop-blur-sm bg-yellow-950/35 flex items-center justify-center">
    <div className="bg-amber-100 rounded-xl pt-12  px-6 pb-6 w-11/12 max-w-md text-center shadow-lg relative">
    <motion.button
  whileTap={{ scale: 0.95 }}
  onClick={() => {
    setMostrarBotonWhatsApp(false);
    setTimeout(() => {
      setMostrarModalResena(true);
    }, 300);
  }}
  className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-800 transition"
>
  X
</motion.button>


      <h2 className="text-3xl font-bold text-orange-950 mb-1 lg:mb-2">¡Ya casi!</h2> 
      <div className="bg-[#fff8de] border-2 border-yellow-900 rounded-lg px-4 py-3 my-4 shadow-sm text-left">
  <p className="text-orange-950 text-lg mb-1">Transferí al siguiente alias:</p>
  <p className="text-2xl font-bold text-yellow-900 tracking-wide">biteme.vcp</p>
  <p className="text-orange-950 text-base mt-2">Titular: <span className="font-semibold">Olivia Iturrusgarai Ballés</span></p>
</div>

      <p className="text-base  text-orange-950 mb-1 lg:mb-2">y envianos el comprobante por whatsapp!</p>
  <div className="flex items-center justify-center">
    
<a
  href={obtenerLinkWhatsApp()}
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => {
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
        setCart([]);
        setClienteNombre('');
        setMostrarBotonWhatsApp(false);
        setMostrarModalResena(true);
      })
      .catch((error) => {
        console.error("Error al guardar el pedido:", error);
        setToast("Error al confirmar el pedido");
      });
  }}
>
  <img className="h-12 sm:h-14" src="/img/whatsapp.png" alt="WhatsApp" />
</a>



  </div>
  </div></div>
)}


     <AccesoPedidos />
      </main>
   

      <AnimatePresence>
      
  {toast && (
    <motion.div
      key="toast"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-5 right-5 bg-[#4b2300] text-white px-4 py-2 rounded shadow-lg z-50"
    >
      {toast}
    </motion.div>
  )}
</AnimatePresence>
{mostrarModalResena && (
  <div className="fixed inset-0 z-[60] backdrop-blur-sm bg-yellow-950/35 flex items-center justify-center">
    <div className="bg-amber-100 rounded-xl pt-12 px-6 pb-6 w-11/12 max-w-md text-center shadow-lg relative">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setMostrarModalResena(false)}
        className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-800 transition"
      >
        X
      </motion.button>

      <FormularioResena onClose={() => {
  setMostrarModalResena(false);
  setToast("¡Gracias por tu reseña!");
}} />

    </div>
  </div>
)}


    
<footer className="w-full bg-[#51290e] mt-10 pt-6 lg:pt-10 px-4">
  <div className="text-center">
    <p className="text-white font-poppins text-lg">Nuestras redes sociales</p>

    <div className="pb-4 pt-2 flex items-center justify-center gap-6">
      <motion.a
        whileTap={{ scale: 0.95 }}
        href="https://www.instagram.com/biteme_vcp"
        target="_blank"
      >
        <img src="/img/ig.png" className="h-10 sm:h-12" alt="Instagram" />
      </motion.a>

      <motion.a
        whileTap={{ scale: 0.95 }}
        href="https://www.tiktok.com/@biteme.vcp"
        target="_blank"
      >
        <img src="/img/tt.png" className="h-10 sm:h-12" alt="TikTok" />
      </motion.a>
    </div>

    <p className="font-poppins text-sm sm:text-base text-white mt-2 pb-8">
      Iturrusgarai, Cisneros y Espósito
    </p>
  </div>
</footer>
    </>
  )
}

export default App
