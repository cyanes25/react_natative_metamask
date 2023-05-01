import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList, Dimensions  } from 'react-native'; // Adicionei ScrollView aqui
import Icon from 'react-native-vector-icons/FontAwesome';
const { width } = Dimensions.get('window');


const Banks = () => {
  const data = [
    {
      id: 1,
      nickname: 'Teste',
      BankCodeTed: '000000',
      BankCodePIX: '000000',
      BranchCode: '2977',
      AccountNumber: '20790-7',
      PIXKey: '04976780392',
    },
    {
      id: 2,
      nickname: 'Teste',
      BankCodeTed: '000000',
      BankCodePIX: '000000',
      BranchCode: '2977',
      AccountNumber: '20790-7',
      PIXKey: '04976780392',
    },
  
  
  ];


    const TransactionCard = ({ item }) => {
      return (
        <View style={styles.card}>
          
          <Text style={styles.cardText}>ID: {item.id}</Text>
          <Text style={styles.cardText}>Nickname: {item.nickname}</Text>
          <Text style={styles.cardText}>Bank Code TED: {item.BankCodeTed}</Text>
          <Text style={styles.cardText}>Bank Code PIX: {item.BankCodePIX}</Text>
          <Text style={styles.cardText}>Branch Code: {item.BranchCode}</Text>
          <Text style={styles.cardText}>Account Number: {item.AccountNumber}</Text>
          <Text style={styles.cardText}>PIX Key: {item.PIXKey}</Text>
        </View>
      );
    };
    
  return (
    <View style={styles.container}>
      <View style={styles.header}>
     
        <Text style={styles.title}>Bank accounts</Text>  
          <TouchableOpacity style={styles.depositButton}>
            <Text style={styles.buttonText}>ADD BANK</Text>
          </TouchableOpacity>
        
      </View>


      <View style={styles.whiteBox}>
       
        <Text style={styles.boxSubtitle}>To remove or update a bank account, contact us at sac@brla.digital. Learn about supported bank accounts here.</Text>
      </View>

     
      
      <View style={styles.transactions}>
        <Text style={styles.transactionsTitle}>Accounts</Text>
        <FlatList
          horizontal
          data={data}
          renderItem={({ item }) => <TransactionCard item={item} />}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          snapToInterval={width}
          decelerationRate="fast"
        />
      </View>
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  passKycButton: {
    backgroundColor: '#00dc84',
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
    
  },
  linkWalletButton: {
    backgroundColor: '#08383f',
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  transferButton: {
    borderColor: '#00dc84',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  depositButton: {
    backgroundColor: '#008884',
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  whiteBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 24,
  },
  boxTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
    boxSubtitle: {
    fontSize: 16,
    
  },
  documentationBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  documentationContent: {
    flex: 1,
  },
  documentationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  documentationSubtitle: {
    fontSize: 14,
    marginBottom: 8,
    paddingRight: 4,
  },
  seeGuidesButton: {
    borderColor: '#00dc84',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },

  transactions: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  card: {
    width: width - 32, // Ajuste a largura do cartão para ocupar a tela inteira
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 4,
  }, 

  title: {
    fontSize: 24,
    color: '#08383f',
    marginRight: 'auto',
    marginBottom: 6,
  },


});

export default Banks;

