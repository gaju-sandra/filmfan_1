import { createContext, useContext, useState } from 'react'

const FavouritesContext = createContext()

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('favourites')) || [] } catch { return [] }
  })

  const toggle = (movie) => {
    setFavourites((prev) => {
      const exists = prev.find((m) => m.id === movie.id)
      const updated = exists ? prev.filter((m) => m.id !== movie.id) : [...prev, movie]
      localStorage.setItem('favourites', JSON.stringify(updated))
      return updated
    })
  }

  const isFav = (id) => favourites.some((m) => m.id === id)

  return (
    <FavouritesContext.Provider value={{ favourites, toggle, isFav }}>
      {children}
    </FavouritesContext.Provider>
  )
}

export const useFavourites = () => useContext(FavouritesContext)
