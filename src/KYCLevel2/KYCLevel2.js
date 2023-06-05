import React, { useState, useEffect } from 'react';
import { Button, View } from 'react-native';
import IdwallSdk, {
  IdwallDocumentType,
  IdwallDocumentSide,
} from '@idwall/react-native-idwall-sdk';
import KYCPFLevel1 from '../KYCLevel1/KYCLevel1';

const KYCPFLevel2 = () => {
  const [docType, setDocType] = useState(null);

  useEffect(() => {
    IdwallSdk.initialize('102f2511-e55d-4f4a-ad53-ac56c0e79fde');
    if (IdwallSdk.ios) {
      IdwallSdk.ios.setupPublicKeys(["AHYMQP+2/KIo32qYcfqnmSn+N/K3IdWallKey=", "tDilFQ4366PMdAmN/kyNiBQy24YHjuDs6Qsa6Oc/4c8="]);
    }
  }, []);

  const handleRgCapture = async () => {
    try {
      await IdwallSdk.requestDocument(IdwallDocumentType.RG, IdwallDocumentSide.FRONT);
      await IdwallSdk.requestDocument(IdwallDocumentType.RG, IdwallDocumentSide.BACK);
      const token = await IdwallSdk.sendRgWithLivenessData();
      console.log("Token: " + token);
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  const handleCnhCapture = async () => {
    try {
      await IdwallSdk.requestDocument(IdwallDocumentType.CNH, IdwallDocumentSide.FRONT);
      const token = await IdwallSdk.sendCnhWithLivenessData();
      console.log("Token: " + token);
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  return (
    <View>
      <Button title="Select RG" onPress={() => setDocType('RG')} />
      <Button title="Select CNH" onPress={() => setDocType('CNH')} />
      {docType === 'RG' && <Button title="Start RG Capture" onPress={handleRgCapture} />}
      {docType === 'CNH' && <Button title="Start CNH Capture" onPress={handleCnhCapture} />}
    </View>
  );
};

export default KYCPFLevel2;
