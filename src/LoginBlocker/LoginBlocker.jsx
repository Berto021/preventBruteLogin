import { Button, Form, Input } from "antd";
import React, { useState } from "react";

export const LoginBlocker = () => {
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedTimes, setBlockedTimes] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [feedback, setFeedback] = useState("");

  const maxAttempts = 3;
  const correctPassword = "12345";

  const timeDictionary = [5, 120, 300, 600];

  function formatRemainingTimeMessage(time) {
    if (time < 60) {
      setFeedback(`Aguarde ${time} segundos antes de tentar novamente.`);
    } else {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      setFeedback(
        `Aguarde ${minutes} minutos${
          seconds > 0 ? ` e ${seconds} segundos` : ""
        } antes de tentar novamente.`
      );
    }
  }

  function handleSubmit(values) {
    const password = values.password;

    if (isBlocked) {
      formatRemainingTimeMessage(remainingTime);
      return;
    }

    if (password === correctPassword) {
      setFeedback("Acesso permitido! Bem-vindo.");
      resetState();
      return;
    }

    const newAttempts = attempts + 1;

    if (newAttempts >= maxAttempts) {
      const blockDuration = timeDictionary[blockedTimes];
      setIsBlocked(true);
      startCountdown(blockDuration);
      setBlockedTimes((prev) => prev + 1);
    } else {
      setFeedback(
        `Senha incorreta. Tentativas restantes: ${maxAttempts - newAttempts}`
      );
    }

    setAttempts(newAttempts);
  }

  function startCountdown(duration) {
    setRemainingTime(duration);
    setFeedback(`Bloqueado por ${duration} segundos.`);

    const countdown = setInterval(() => {
      setRemainingTime((time) => {
        if (time > 1) {
          return time - 1;
        } else {
          clearInterval(countdown);
          setIsBlocked(false);
          setFeedback("Você pode tentar novamente.");
          setAttempts(0);
          return 0;
        }
      });
    }, 1000);
  }

  function resetState() {
    setAttempts(0);
    setRemainingTime(0);
    setIsBlocked(false);
  }

  return (
    <div>
      <Form
        onFinish={handleSubmit}
        style={{ display: "flex", gap: 20, alignItems: "center" }}
      >
        <Form.Item
          label="Digite a senha:"
          name="password"
          rules={[{ required: true, message: "Por favor, insira sua senha!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            type="primary"
            style={{ width: 100, backgroundColor: "black", color: "white" }}
          >
            Entrar
          </Button>
        </Form.Item>
      </Form>
      <p>{feedback}</p>
    </div>
  );
};
