
import React, { useEffect, useRef } from 'react';
import { sendNotification, requestNotificationPermission, getPermissionStatus } from '../lib/notifications';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

const NotificationManager: React.FC = () => {
  const { user } = useAuth();
  const { medications, appointments, messages } = useData();
  const sentNotifications = useRef<Set<string>>(new Set());
  const lastMessageCount = useRef(0);

  useEffect(() => {
    // Initialize notification permission
    const initNotifications = async () => {
        const status = getPermissionStatus();
        if (status === 'default') {
            await requestNotificationPermission();
        }
    };
    initNotifications();
  }, []);

  // --- 1. Message Listener (Push Notification Simulation) ---
  useEffect(() => {
    if (!user) return;

    // Only trigger if we have MORE messages than before
    if (messages.length > lastMessageCount.current) {
        // Find the latest message
        const latestMsg = messages[messages.length - 1];

        // Ensure message exists, is NOT from current user, is UNREAD, and we haven't notified yet
        const notificationKey = `msg-${latestMsg.id}`;
        
        if (latestMsg && 
            latestMsg.receiverId === user.id && 
            !latestMsg.read && 
            !sentNotifications.current.has(notificationKey)) {
            
            // Determine sender name
            const senderName = latestMsg.senderId === 'admin-1' ? 'Dr. Edgar Sarmento' : 'Nutri. Ana Clara';
            
            sendNotification(`Nova mensagem de ${senderName}`, {
                body: latestMsg.content.length > 50 ? latestMsg.content.substring(0, 50) + '...' : latestMsg.content,
                tag: notificationKey
            });

            sentNotifications.current.add(notificationKey);
        }
    }
    
    // Update ref
    lastMessageCount.current = messages.length;
  }, [messages, user]);


  // --- 2. Interval Check for Reminders ---
  useEffect(() => {
    const checkReminders = () => {
        const now = new Date();
        const currentHours = now.getHours().toString().padStart(2, '0');
        const currentMinutes = now.getMinutes().toString().padStart(2, '0');
        const currentTime = `${currentHours}:${currentMinutes}`;
        const todayDate = now.toLocaleDateString('pt-BR');

        // Check Medications
        medications.forEach(med => {
          const notificationKey = `med-${med.id}-${todayDate}`;
          if (med.time === currentTime && !med.taken && !sentNotifications.current.has(notificationKey)) {
            sendNotification(`Hora da Medicação: ${med.name}`, {
              body: `Lembre-se de tomar ${med.dosage}. Mantenha a disciplina!`,
              tag: notificationKey
            });
            sentNotifications.current.add(notificationKey);
          }
        });

        // Check Appointments
        appointments.forEach(apt => {
            if (apt.date === todayDate) {
                const [aptHour, aptMin] = apt.time.split(':').map(Number);
                const aptDate = new Date();
                aptDate.setHours(aptHour, aptMin, 0);

                const diffMinutes = (aptDate.getTime() - now.getTime()) / (1000 * 60);
                
                const key2Hours = `apt-${apt.id}-2h`;
                const key15Mins = `apt-${apt.id}-15m`;

                if (diffMinutes > 115 && diffMinutes < 125 && !sentNotifications.current.has(key2Hours)) { 
                     sendNotification(`Consulta em 2 horas`, {
                        body: `Sua consulta (${apt.type}) é hoje às ${apt.time}. Prepare-se.`,
                        tag: key2Hours
                     });
                     sentNotifications.current.add(key2Hours);
                }

                if (diffMinutes > 10 && diffMinutes < 20 && !sentNotifications.current.has(key15Mins)) {
                    sendNotification(`Consulta em breve!`, {
                        body: `Sua consulta começará em 15 minutos.`,
                        tag: key15Mins
                     });
                     sentNotifications.current.add(key15Mins);
                }
            }
        });
    };

    const intervalId = setInterval(checkReminders, 30000); // 30s check
    return () => clearInterval(intervalId);
  }, [medications, appointments]);

  return null;
};

export default NotificationManager;
