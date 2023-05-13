import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { useForm } from 'react-hook-form';
import { ENDPOINT } from '../variaveis';
import { Toast } from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';
function KYCPFLevel1() {
  const [formattedDate, setFormattedDate] = useState('');
  const { register, handleSubmit, setValue, formState: { isValid } } = useForm({ mode: 'onChange' });
  const [displayDate, setDisplayDate] = useState(''); // Adicione esta linha
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formattedCPF, setFormattedCPF] = useState(''); // Adicione esta linha
  const onSubmit = async (data) => {
    const response = await fetch(`${ENDPOINT}/user/kyc/pf/level1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        cpf: data.cpf,
        birthDate: formattedDate,
        fullName: data.full_name
      }),
    });

    if (response.status === 200 || response.status === 201) {
      Toast.show({
        type: 'success',
        text1: 'KYC enviado com sucesso.'
      });
    } else {
      let responseData = {};
      if (response.headers.get('content-type').includes('application/json')) {
        responseData = await response.json();
        Toast.show({
          type: 'error',
          text1: `Falha ao enviar KYC: ${responseData.message || 'Ocorreu um erro desconhecido.'}`,
        });
      }
      console.error('Error:', responseData);
    }
  };

  const formatCPF = (value) => {
    const formattedValue = value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    return formattedValue;
  };

  const formatDate = (date) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const d = new Date(date);
    return `${d.getFullYear()}-${monthNames[d.getMonth()]}-${String(d.getDate()+1).padStart(2, '0')}`;
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split('T')[0];
      setFormattedDate(formatted);
      setValue('birth_date', formatted);
      console.log('Formatted date:', formatted);
      
    }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };
  const currentYear = new Date().getFullYear();
  const minDate = `${currentYear - 120}-01-01`;
  const maxDate = `${currentYear - 18}-12-31`;

  
  const handleCPFChange = (text) => { // Adicione esta função
    const cpf = formatCPF(text);
    setValue('cpf', cpf);
    setFormattedCPF(cpf);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KYC Nível 1</Text>

      <View style={styles.inputsContainer}>
        <TextInput
          onChangeText={text => setValue('full_name', text)}
          autoCapitalize="words"
          placeholder="Nome completo"
          style={styles.input}
        />

        <TextInput
          onChangeText={handleCPFChange}
          keyboardType="numeric"
          maxLength={14}
          placeholder="CPF"
          style={styles.input}
          value={formattedCPF}
        />
<View style={styles.input}>
          <Text>Data de nascimento:</Text>
          {formattedDate ? (
            <Text style={styles.dateText}>{formattedDate}</Text>
          ) : (
            <Text style={styles.dateText}>Selecione uma data</Text>
          )}
          <TouchableOpacity onPress={openDatePicker} style={styles.dateButton}>
            <Text style={styles.dateButtonText}>Alterar data</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000)}
            minimumDate={new Date(Date.now() - 120 * 365 * 24 * 60 * 60 * 1000)}
          />
        )}

        <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.button}>
          <Text style={styles.buttonText}>Enviar KYC</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 20,
    color: '#000',
  },
  inputsContainer: {
    marginBottom: 16,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#008884',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },

  dateButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#00dc84',
    alignItems: 'center',
  },
  
  dateText: {
    fontSize: 16,
    color: '#000',
  },


});

export default KYCPFLevel1;