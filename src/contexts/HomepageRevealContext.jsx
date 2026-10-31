import { createContext, useContext, useState } from 'react'

const HomepageRevealContext = createContext({
  homepageRevealed: false,
  setHomepageRevealed: () => {},
})

export function HomepageRevealProvider({ children }) {
  const [homepageRevealed, setHomepageRevealed] = useState(false)

  return (
    <HomepageRevealContext.Provider value={{ homepageRevealed, setHomepageRevealed }}>
      {children}
    </HomepageRevealContext.Provider>
  )
}

export function useHomepageReveal() {
  return useContext(HomepageRevealContext)
}
