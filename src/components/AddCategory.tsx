import React, { useState } from "react";
import { addCustomCategory } from "../services/categoryService";
import { FaPlus } from "react-icons/fa";

interface AddCategoryProps {
  userId: string;
  onCategoryAdded: () => void; // Para refrescar lista al agregar
}

const AddCategory: React.FC<AddCategoryProps> = ({
  userId,
  onCategoryAdded,
}) => {
  const [name, setName] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCustomCategory(userId, name);
      setName("");
      onCategoryAdded();
      alert("Categoría agregada con éxito 🎉");
    } catch (error) {
      console.error(error);
      alert("Error al agregar la categoría");
    }
  };

  return (
    <form onSubmit={handleAdd} className="flex items-center gap-2 mt-4">
      <input
        type="text"
        placeholder="Nueva categoría"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
      >
        <FaPlus />
        Agregar
      </button>
    </form>
  );
};

export default AddCategory;
