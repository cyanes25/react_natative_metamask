import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useForm } from 'react-hook-form';
import { ENDPOINT } from '../../variaveis';
import Toast from 'react-native-toast-message';

const KYCPFLevel2 = () => {
  // ... (mantenha o restante do seu estado e funções aqui)
  const [sdkWebHTML, setSdkWebHTML] = useState(''); // Adicione esta linha
  // Atualize o useEffect para configurar o HTML para o WebView
  useEffect(() => {
    const handleComplete = async (token) => {
      // ... (mantenha o restante do seu código de manipulação aqui)
    };

    setSdkWebHTML(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>IDW SDK Web</title>
      <script>
        function loadSdkWeb() {
          const script = document.createElement('script');
          script.src = 'https://sdkweb-lib.idwall.co/index.js';
          script.onload = () => {
            idwSDKWeb({
              token: 'U2FsdGVkX1+GmUoe73HQ3ZX8oDwce3mgB0fhwidU+GKuluEArQ==',
              onRender: () => {
                console.log('it renders!');
              },
              onComplete: ({ token }) => {
                console.log('SDK Token', token);
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'onComplete', token }));
              },
              onError: (error) => {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'onError', error }));
              },
            });
          };
          document.body.appendChild(script);
        }
      </script>
    </head>
    <body onload="loadSdkWeb()">
      <div data-idw-sdk-web></div>
    </body>
    </html>
  `);
  
  }, []);

  // Função para lidar com mensagens do WebView
  const onMessage = (event) => {
    const message = JSON.parse(event.nativeEvent.data);

    if (message.type === 'onComplete') {
      handleComplete(message.token);
    } else if (message.type === 'onError') {
      alert(message.error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>KYC Level 2</Text>
      <WebView
        source={{ html: sdkWebHTML }}
        onMessage={onMessage}
        originWhitelist={['*']}
        mixedContentMode="always"
        allowUniversalAccessFromFileURLs={true} // Adicione esta linha
        javaScriptEnabled={true}
        style={styles.webView}
      />
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 12,
  },
  webView: {
    flex: 1,
  },
});

export default KYCPFLevel2;
