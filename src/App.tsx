import React, { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, AlertCircle, Package2, ArrowUpDown } from 'lucide-react';
import type { InventoryItem, SortDirection } from './types';

function App() {
  const [items, setItems] = useState<InventoryItem[]>([
    { id: '1', name: 'Laptop', category: 'Electronics', quantity: 5, price: 999.99 },
    { id: '2', name: 'Desk Chair', category: 'Furniture', quantity: 12, price: 199.99 },
    { id: '3', name: 'Mouse', category: 'Electronics', quantity: 8, price: 29.99 },
  ]);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(items.map(item => item.category));
    return ['all', ...Array.from(uniqueCategories)];
  }, [items]);

  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];
    
    if (selectedCategory !== 'all') {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    result.sort((a, b) => {
      const modifier = sortDirection === 'asc' ? 1 : -1;
      return (a.quantity - b.quantity) * modifier;
    });
    
    return result;
  }, [items, selectedCategory, sortDirection]);

  const handleAddItem = (newItem: Omit<InventoryItem, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setItems(prev => [...prev, { ...newItem, id }]);
    setIsAddModalOpen(false);
  };

  const handleEditItem = (updatedItem: InventoryItem) => {
    setItems(prev => prev.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Package2 size={24} className="text-indigo-600" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 text-transparent bg-clip-text">
                Inventory Management
              </h1>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary"
            >
              <Plus size={20} /> Add Item
            </button>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field min-w-[150px]"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>

            <button
              onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="btn-secondary flex items-center gap-2"
            >
              <ArrowUpDown size={16} />
              Sort by Quantity {sortDirection === 'asc' ? '(Low to High)' : '(High to Low)'}
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedItems.map(item => (
                  <tr 
                    key={item.id} 
                    className={`table-row ${item.quantity < 10 ? 'bg-red-50 hover:bg-red-100' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {item.name}
                        {item.quantity < 10 && (
                          <div className="ml-2 group relative">
                            <AlertCircle size={16} className="text-red-500" />
                            <div className="absolute left-full ml-2 px-2 py-1 bg-red-600 text-white text-xs rounded 
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                              Low stock alert!
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${item.quantity < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-medium">
                        ${item.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="text-blue-600 hover:text-blue-800 transition-colors p-1 hover:bg-blue-50 rounded"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-800 transition-colors p-1 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredAndSortedItems.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No items found. Add some items to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(isAddModalOpen || editingItem) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 fade-enter">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const itemData = {
                  name: formData.get('name') as string,
                  category: formData.get('category') as string,
                  quantity: parseInt(formData.get('quantity') as string, 10),
                  price: parseFloat(formData.get('price') as string),
                };

                if (editingItem) {
                  handleEditItem({ ...itemData, id: editingItem.id });
                } else {
                  handleAddItem(itemData);
                }
              }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingItem?.name}
                  required
                  className="input-field"
                  placeholder="Enter item name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  defaultValue={editingItem?.category}
                  required
                  className="input-field"
                  placeholder="Enter category"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  defaultValue={editingItem?.quantity}
                  required
                  min="0"
                  className="input-field"
                  placeholder="Enter quantity"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  defaultValue={editingItem?.price}
                  required
                  min="0"
                  step="0.01"
                  className="input-field"
                  placeholder="Enter price"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {editingItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;