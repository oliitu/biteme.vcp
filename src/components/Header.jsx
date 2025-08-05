import { useMemo, useEffect, useState } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";



export default function Header({ cart, clearCart}) {

   const [ruta, setRuta] = useState("");
  useEffect(() => {
      const fetchRuta = async () => {
        try {
          const docRef = doc(db, "misrutas", "2"); 
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
            const data = docSnap.data();
            setRuta(data.title); 
          } else {
            console.log("No se encontró el documento con ID 2");
          }
        } catch (error) {
          console.error("Error al obtener la ruta:", error);
        }
      };
  
      fetchRuta();
    }, []);

  const isEmpty = useMemo(() => cart.length === 0, [cart]);

  return (
    <header
  className=" w-full text-white bg-black bg-opacity-40"
  style={{
    backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("/img/header.jpg")`,
    backgroundSize: "cover",
    backgroundPosition: "70%",
  }}
>
  <div className="max-w-screen-xl align-bottom mx-auto w-full flex justify-between items-center px-4">
    <a href={ruta || "#"} onClick={clearCart} className="mb-4 mt-10 lg:mt-28 lg:mb-5"> 
      <img className="img-fluid w-16 md:w-32 lg:w-40" src="/img/logonobg.png" alt="imagen logo" />
    </a>


    {/* <div className="mt-10 lg:mt-48 lg:mb-5 carrito relative">
    <img
  src="/img/carrito.png"
  alt="imagen carrito"
  className="w-6 md:w-9 lg:w-15 object-contain "
/>
      
<div
  id="carrito"
  className="mt-0 absolute right-0 w-full max-w-sm sm:w-96 bg-[#fff8de] rounded shadow p-4 z-10"
>
  {isEmpty ? (
    <p className="text-center">El carrito está vacío</p>
  ) : (
    <>




      <div className="w-full table-auto hidden sm:table">
      <table className="w-full table-auto hidden sm:table">
        <thead>
          <tr className="bg-[#fcb9c6] text-left">
            <th className="p-2 font-poppins text-orange-950 text-center">Imagen</th>
            <th className="p-2 font-poppins text-orange-950 text-center">Nombre</th>
            <th className="p-2 font-poppins text-orange-950 text-center">Precio</th>
            <th className="p-2 font-poppins text-orange-950">Cantidad</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-yellow-900">
          {cart.map((cookie) => (
            <tr key={cookie.id} className="border-b border-yellow-900">
              <td className="p-2">
                <img
                  src={`/img/${cookie.image}.png`}
                  alt={cookie.name}
                  className="w-10 mx-auto h-10 object-cover rounded"
                />
              </td>
              <td className="p-2 text-orange-950">{cookie.name}</td>
              <td className="p-2 text-orange-950">${cookie.price}</td>
              <td className="p-2">
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => decreaseQuantity(cookie.id)}
                    className="cursor-pointer px-2 hover:text-lg hover:bg-[#de8a9b] bg-[#fcb9c6] rounded"
                  >
                    −
                  </motion.button>
                  <span>{cookie.quantity}</span>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => increaseQuantity(cookie.id)}
                    className="cursor-pointer px-2 hover:text-lg hover:bg-[#de8a9b] bg-[#fcb9c6] rounded"
                  >
                    +
                  </motion.button>
                </div>
              </td>
              <td className="p-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => removeFromCart(cookie.id)}
                  className="text-red-600 cursor-pointer text-center hover:text-lg"
                >
                  X
                </motion.button>
              </td>
            </tr>
          ))}
        </tbody>
        
      </table>
      <div className="flex items-center justify-between mt-4">
        <p className="font-semibold">
          Total a pagar: <span className="font-bold">${cartTotal}</span>
        </p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={clearCart}
          className="font-poppins bg-[#fcb9c6] hover:bg-[#de8a9b] px-3 py-2 rounded-lg text-sm"
        >
          Vaciar Carrito
        </motion.button>
      </div>

      <motion.button onClick={() => setMostrarModal(true)}
        whileTap={{ scale: 0.95 }}
        className="btn w-full mt-3 p-2 bg-yellow-900  text-white rounded hover:bg-yellow-950"
      >
        Pagar
      </motion.button></div>
      






      < div className="flex flex-col gap-4 sm:hidden">
        {cart.map((cookie) => (
          <div key={cookie.id} className="flex gap-3 border-b pb-3 border-yellow-900">
            <img
              src={`/img/${cookie.image}.png`}
              alt={cookie.name}
              className="w-16 h-16 drop-shadow-md object-cover rounded"
            />
            <div className=" text-orange-950">
              <h4 className="font-semibold">{cookie.name}</h4>
              <p>${cookie.price}</p>
              <div className="flex items-center gap-2 mt-1">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => decreaseQuantity(cookie.id)}
                  className="px-2 bg-[#fcb9c6] rounded"
                >
                  −
                </motion.button>
                <span>{cookie.quantity}</span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => increaseQuantity(cookie.id)}
                  className="px-2 bg-[#fcb9c6] rounded"
                >
                  +
                </motion.button>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => removeFromCart(cookie.id)}
              className="text-red-600 text-2xl ml-2 self-center"
            >
              X
            </motion.button>
          </div>
        ))}
        <div className='justify-items-start'>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={clearCart}
          className="font-poppins mt-2  bg-[#fcb9c6] hover:bg-[#de8a9b] px-3 py-2 mb-4 rounded-lg text-sm"
        >
          Vaciar Carrito
        </motion.button>
        
        <p className="self-start font-semibold">
          Total a pagar: <span className="font-bold">${cartTotal}</span>
        </p>
        <div className="flex items-center justify-center">
  <motion.button
    onClick={() => setMostrarModal(true)}
    className="text-white bg-[#6e3712] font-poppins min-w-50 hover:bg-yellow-950 mt-2 rounded-sm text-base px-5 py-2.5 text-center"
  >
    Pagar
  </motion.button>
</div>

    
      </div>

      </div>
    </>
  )}
</div>

    </div> */}
  </div>
</header>
  );
}


