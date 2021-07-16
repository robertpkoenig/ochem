import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (

    // <Context.Provider>
        <Component {...pageProps} />
    // </Context.Provider>

  )
}
export default MyApp
