import { useState, useEffect, useMemo } from 'react'
import Cookie from './components/Cookie'
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header'
import AccesoPedidos from "./components/AccesoPedidos";
import FormularioResena from './components/FormularioResena';
import{db as cookiesData } from './data/db'
import './App.css'
import { collection, addDoc, Timestamp, doc, setDoc, increment } from "firebase/firestore";
import { db } from "./firebase";
import Carrito from './components/Carrito';
import ModalPedido from "./components/ModalPedido";
import ModalWhatsApp from './components/ModalWhatsApp';
import Toast from './components/Toast';



function App() {
  const [linkWhatsApp, setLinkWhatsApp] = useState("");

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

const obtenerLinkWhatsApp = () => {
  if (!cart.length || !clienteNombre.trim()) return "";

  const lineaGalletas = cart
    .map(item => `- ${item.name} x${item.quantity} = $${(item.quantity * item.price).toFixed(2)}`)
    .join('\n');

  const mensaje = `Hola mamuuu, soy ${clienteNombre}. Te envío el comprobante de mi pedido:\n${lineaGalletas}\nTotal: $${cartTotal.toFixed(2)}`;

  const numero = "5493541396868"; // sin + ni espacios
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
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
    const link = obtenerLinkWhatsApp(); // ✅ generás el link ANTES de vaciar carrito
setLinkWhatsApp(link);

    setCart([]);
    setClienteNombre('');

    // ✅ Calcular totales por chica
    let totalAgus = 0;
    let totalOli = 0;
    let totalGuada = 0;
    const totalGalletas = cart.reduce((acc, item) => acc + item.quantity, 0);
    cart.forEach(item => {
  let precioUnitario = item.price;

  // 🔹 Si son exactamente 3 galletas en el pedido → precio promo (2000)
  if (totalGalletas === 3) {
    precioUnitario = 2000;
  }

  const subtotal = precioUnitario * item.quantity;

  if (item.id === 1 || item.id === 5) totalAgus += subtotal;
  if (item.id === 2 || item.id === 3) totalOli += subtotal;
  if (item.id === 4 || item.id === 6) totalGuada += subtotal;
});
    const totalesRef = collection(db, "totalesPorChica");

    if (totalAgus > 0) {
      await setDoc(doc(totalesRef, "agus"), { [metodoPago]: increment(totalAgus) }, { merge: true });
    }
    if (totalOli > 0) {
      await setDoc(doc(totalesRef, "oli"), { [metodoPago]: increment(totalOli) }, { merge: true });
    }
    if (totalGuada > 0) {
      await setDoc(doc(totalesRef, "guada"), { [metodoPago]: increment(totalGuada) }, { merge: true });
    }

    if (metodoPago === "efectivo") {
      setMostrarModalResena(true);
    } else {
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
  // Si hay exactamente 5 cookies, precio promocional
  if (totalCantidad === 3) {
    return 6000;
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
    <p className="text-lg lg:text-xl font-poppins text-orange-950">Elegí tu favorita y llevate 3 por $6000</p>
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

<ModalPedido
  mostrarModal={mostrarModal}
  setMostrarModal={setMostrarModal}
  cart={cart}
  cartTotal={cartTotal}
  clienteNombre={clienteNombre}
  setClienteNombre={setClienteNombre}
  metodoPago={metodoPago}
  setMetodoPago={setMetodoPago}
  confirmarPedido={confirmarPedido}
  confirmando={confirmando}
/>

{mostrarBotonWhatsApp && (
  <>
    {console.log("Link generado:", obtenerLinkWhatsApp())}
    <ModalWhatsApp
      linkWhatsApp={linkWhatsApp}
      setMostrarBotonWhatsApp={setMostrarBotonWhatsApp}
      setMostrarModalResena={setMostrarModalResena}
      setToast={setToast}
    />
  </>
)}



     <AccesoPedidos />
      </main>
   

      <AnimatePresence>
      
  {toast && (
   <Toast message={toast} />
    
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
