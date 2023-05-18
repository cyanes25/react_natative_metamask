import React, { useState } from 'react';
import { Button, View } from 'react-native';
import IdwallSdk, {
  IdwallDocumentType,
  IdwallDocumentSide,
} from '@idwall/react-native-idwall-sdk';
import KYCPFLevel1 from '../KYCLevel1/KYCLevel1';

IdwallSdk.initialize('sdk_auth_key');
if (IdwallSdk.ios) {
  IdwallSdk.ios.setupPublicKeys(["AHYMQP+2/KIo32qYcfqnmSn+N/K3IdWallKey=, tDilFQ4366PMdAmN/kyNiBQy24YHjuDs6Qsa6Oc/4c8="]);
}

const KYCPFLevel2 = () => {
  const [docType, setDocType] = useState(null);

  const handleDocumentCapture = async () => {
    try {
      if (docType === 'RG') {
        // Capture front and back for RG
        await IdwallSdk.requestDocument(IdwallDocumentType.RG, IdwallDocumentSide.FRONT);
        await IdwallSdk.requestDocument(IdwallDocumentType.RG, IdwallDocumentSide.BACK);
      } else if (docType === 'CNH') {
        // Capture only front for CNH
        await IdwallSdk.requestDocument(IdwallDocumentType.CNH, IdwallDocumentSide.FRONT);
      }

      // Capture liveness
      await IdwallSdk.requestLiveness();

      // Submit document and liveness data
      let token;
      if (docType === 'RG') {
        token = await IdwallSdk.sendRgWithLivenessData();
      } else if (docType === 'CNH') {
        token = await IdwallSdk.sendCnhWithLivenessData();
      }

      console.log("Token: " + token);

    } catch (error) {
      console.log("Error: " + error);
    }
  };

  return (
    <View>
      <Button title="Select RG" onPress={() => setDocType('RG')} />
      <Button title="Select CNH" onPress={() => setDocType('CNH')} />
      {docType && <Button title="Start Capture" onPress={handleDocumentCapture} />}
    </View>
  );
};

export default KYCPFLevel2;
