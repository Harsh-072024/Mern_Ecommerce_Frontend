import { useEffect, useRef, useState } from 'react';
import { IoIosCloseCircle } from 'react-icons/io';
import { Link } from 'react-router-dom';
import useDebounce from '../../hooks/useDebounce';
import { BASE_URL } from '../../app/config';

const SearchModal = ({ open, setOpen }) => {
  const modalRef = useRef();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setLoading(false);
      return;
    }

    let isActive = true; // prevent stale updates

    const fetchSearchResults = async () => {
      setLoading(true);

      const response = await fetch(`${BASE_URL}/products?search=${debouncedQuery}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if (!isActive) return;

      setResults(data);
      setLoading(false);
    };

    fetchSearchResults();

    return () => {
      isActive = false;
    };
  }, [ debouncedQuery]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [setOpen]);

  // Close on outside click
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  if (!open) return null;

  return (
    <div
      onClick={handleOutsideClick}
      className="fixed inset-0 bg-black/70 flex justify-center items-start z-50"
    >
      <div
        ref={modalRef}
        className="bg-white w-full sm:w-1/2 sm:mt-20 p-4 rounded-lg shadow-lg h-screen sm:min-h-[50vh] sm:max-h-[70vh] overflow-y-auto"
      >
        {/* Input */}
        <div className="flex items-center relative">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full border border-gray-600 p-2 rounded outline-none"
          />
          <button
            onClick={() => setOpen(false)}
            className="absolute right-2 transition 0.3s ease hover:text-indigo-800"
          >
            <IoIosCloseCircle size={30} />
          </button>
        </div>

        {/* Results */}
        <div className="mt-4 space-y-2">
          {loading && <p className="text-gray-500">Searching...</p>}

          {!loading &&
            results.length > 0 &&
            results.map((item) => (
              <Link
                key={item.id}
                to={`/product-details/${item.id}`}
                className="block p-2 rounded
                           border border-transparent
                           hover:border-gray-300
                           hover:bg-gray-100
                           transition-all duration-200"
                onClick={() => setOpen(false)}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <p>{item.title}</p>
                </div>
              </Link>
            ))}

          {!loading && query && results.length === 0 && (
            <p className="text-gray-500 text-center">No results found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
