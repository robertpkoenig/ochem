import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;600;700" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600" rel="stylesheet" />
            <link rel="shortcut icon" href="/favicon.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument