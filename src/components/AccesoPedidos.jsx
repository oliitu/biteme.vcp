import { db } from "../firebase";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

function AccesoPedidos() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
const [ruta, setRuta] = useState("");

  useEffect(() => {
    const fetchRuta = async () => {
      try {
        const docRef = doc(db, "misrutas", "3"); 
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setRuta(data.title); 
        } else {
          console.log("No se encontró el documento con ID 3");
        }
      } catch (error) {
        console.error("Error al obtener la ruta:", error);
      }
    };

    fetchRuta();
  }, []);

  const verificarClave = () => {
    if (password === "papota") {
      window.location.href = ruta || "#";
    } else {
      setError("Contraseña incorrecta");
    }
  };

  return (
    <>
      <button
        onClick={() => setMostrarModal(true)}
        className="hover:bg-yellow-950 bg-amber-900 text-white px-4 py-4 mt-4 lg:mt-0 lg:mb-4 rounded-full "
      >
        
      </button>

      {mostrarModal && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-amber-100 p-6 rounded-xl shadow-md w-80 text-center relative">
            <button
              className="absolute top-2 right-2 text-red-600 font-bold"
              onClick={() => {
                setMostrarModal(false);
                setError("");
                setPassword("");
              }}
            >
              X
            </button>
            <h2 className="text-lg font-semibold text-amber-950 mb-3">Ingresá la contraseña</h2>
            <input
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Previene que envíe un form si hay
      verificarClave();
    }
  }}
  placeholder="Contraseña"
  className="w-full border rounded px-3 py-2 mb-3"
/>

            {error && <p className="text-red-500 mb-2">{error}</p>}
            <button
              className="bg-[#ffa2b5] hover:bg-[#ff95ab] text-white px-4 py-2 rounded "
              onClick={verificarClave}
            >
              Ingresar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AccesoPedidos;
