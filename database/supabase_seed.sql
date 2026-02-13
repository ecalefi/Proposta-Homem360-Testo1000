-- SEED DATA PARA APP DR. EDGAR SARMENTO
-- Execute este script no SQL Editor do Supabase APÓS rodar o Schema atualizado.

-- 1. Limpar dados existentes (Opcional - CUIDADO)
-- truncate table public.faq_items cascade;
-- truncate table public.exams cascade;
-- truncate table public.medical_records cascade;
-- truncate table public.habit_logs cascade;
-- truncate table public.health_metrics cascade;
-- truncate table public.appointments cascade;
-- truncate table public.profiles cascade;

-- 2. Inserir Perfis (Agora funciona sem o constraint de auth.users)
INSERT INTO public.profiles (id, email, name, role, avatar_url, created_at) VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'roberto.mendes@email.com', 'Roberto Mendes', 'patient', 'https://picsum.photos/200', '2025-06-15 10:00:00-03'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b02', 'dr.edgar@clinica.com', 'Dr. Edgar Sarmento', 'admin', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200', '2024-01-01 10:00:00-03'),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c03', 'carlos.andrade@email.com', 'Carlos Andrade', 'patient', 'https://picsum.photos/201', '2025-07-20 10:00:00-03'),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380d04', 'andre.silva@email.com', 'André Silva', 'patient', 'https://picsum.photos/202', '2025-08-10 10:00:00-03'),
('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380e05', 'felipe.costa@email.com', 'Felipe Costa', 'patient', 'https://picsum.photos/203', '2025-09-05 10:00:00-03'),
('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380f06', 'marcos.vinicius@email.com', 'Marcos Vinícius', 'patient', 'https://picsum.photos/204', '2025-05-15 10:00:00-03')
ON CONFLICT (id) DO NOTHING;

-- 3. Inserir Métricas de Saúde (Histórico Jan 2026 para Roberto)
INSERT INTO public.health_metrics (patient_id, metric_type, value, unit, recorded_at) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'testosterone', 320, 'ng/dL', '2025-08-15 08:00:00-03'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'testosterone', 450, 'ng/dL', '2025-09-15 08:00:00-03'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'testosterone', 580, 'ng/dL', '2025-10-15 08:00:00-03'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'testosterone', 690, 'ng/dL', '2025-11-15 08:00:00-03'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'testosterone', 750, 'ng/dL', '2025-12-15 08:00:00-03'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'testosterone', 820, 'ng/dL', '2026-01-10 08:00:00-03'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'weight', 94.0, 'kg', '2025-08-15 08:00:00-03'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'weight', 86.0, 'kg', '2026-01-18 08:00:00-03'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'psa', 1.2, 'ng/mL', '2026-01-10 08:00:00-03');

-- 4. Inserir Agendamentos
INSERT INTO public.appointments (patient_id, doctor_id, date_time, type, status, notes) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b02', '2025-10-15 14:00:00-03', 'Consulta Presencial', 'concluido', 'Início do protocolo.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b02', '2026-01-18 14:30:00-03', 'Consulta Presencial', 'confirmado', 'Avaliação trimestral.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b02', '2026-02-25 09:00:00-03', 'Retorno', 'pendente', 'Check-up.'),
-- Agendamentos fictícios para outros pacientes aparecerem no dashboard
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c03', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b02', '2026-01-18 10:30:00-03', 'Retorno', 'confirmado', 'Acompanhamento PSA'),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380d04', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b02', '2026-01-18 09:00:00-03', 'Consulta Presencial', 'confirmado', 'Pós-Op Vasectomia');


-- 5. Inserir Log de Hábitos
INSERT INTO public.habit_logs (patient_id, log_date, water_intake, water_target, workout_completed, sleep_hours, mood, family_time, hobby_time) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', '2026-01-18', 2250, 3000, true, 7.5, 'good', true, false);

-- 6. Inserir Prontuários (Medical Records)
INSERT INTO public.medical_records (patient_id, doctor_id, record_date, title, content, record_type) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b02', '2025-08-15 14:00:00-03', 'Primeira Consulta - Anamnese', 'Paciente refere baixa libido, cansaço excessivo e ganho de peso. Exames iniciais mostram T=320. Iniciado protocolo de mudança de estilo de vida + reposição transdérmica.', 'anamnese'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b02', '2025-10-15 14:30:00-03', 'Evolução Clínica', 'Paciente relata melhora significativa na disposição. Perda de 2.5kg. Ajuste de dose para 50mg/dia.', 'evolucao'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b02', '2025-10-15 14:35:00-03', 'Prescrição', '1. Testosterona Base Pentravan 50mg/pump - 1 pump dia.\n2. Tadalafila 5mg uso diário.\n3. Vitamina D 50.000UI semanal.', 'prescricao');

-- 7. Inserir Exames (Exams)
INSERT INTO public.exams (patient_id, exam_date, title, file_url, exam_type) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', '2026-01-10 08:00:00-03', 'Hemograma e Hormonal Completo', '#', 'laboratorial'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', '2025-12-05 09:30:00-03', 'Ultrassom de Próstata e Vias Urinárias', '#', 'imagem');

-- 8. Inserir FAQ
INSERT INTO public.faq_items (question, answer, category) VALUES
('Como aplicar o gel de testosterona?', 'O gel deve ser aplicado pela manhã, após o banho, em uma área de pele limpa e seca (ombros, braços ou abdômen). Espere secar antes de vestir a roupa.', 'tratamentos'),
('Posso beber álcool durante o tratamento?', 'O consumo moderado não corta o efeito, mas o excesso prejudica o fígado e a produção hormonal natural, além de aumentar a conversão em estrogênio.', 'tratamentos'),
('Qual a frequência ideal de exames?', 'Geralmente a cada 3 ou 4 meses durante o ajuste de dose, e a cada 6 meses na fase de manutenção.', 'consultas');