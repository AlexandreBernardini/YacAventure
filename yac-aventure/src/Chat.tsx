import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

export default function Chat({ route }) {
  const { token, userId, friendId } = route.params; // Récupérer les paramètres de route
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://192.168.1.20:4280/messages', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          userId,
          friendId,
        },
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des messages :', error);
    }
  };

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    sendMessageToServer(messages[0]);
  }, []);

  const sendMessageToServer = async (message) => {
    try {
      await axios.post(
        'http://192.168.1.20:4280/messages',
        {
          text: message.text,
          userId,
          friendId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message :', error);
    }
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#0084ff',
          },
        }}
      />
    );
  };

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={{ marginBottom: 5, marginRight: 5 }}>
          <Icon name="send-circle" size={32} color="#0084ff" />
        </View>
      </Send>
    );
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: userId,
      }}
      renderBubble={renderBubble}
      renderSend={renderSend}
    />
  );
}
