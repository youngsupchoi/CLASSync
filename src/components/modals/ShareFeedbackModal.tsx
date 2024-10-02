"use client";

import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import { isShareFeedbackModalOpenAtom } from "../../recoil/modalAtoms";
import { useRecoilState } from "recoil";

export function ShareFeedbackModal() {
  const [isShareFeedbackModalOpen, setIsShareFeedbackModalOpen] =
    useRecoilState(isShareFeedbackModalOpenAtom);
  const [feedback, setFeedback] = useState("");
  const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);

  function onCloseModal() {
    setIsShareFeedbackModalOpen(false);
    setFeedback("");
  }

  function onCloseThankYouModal() {
    setIsThankYouModalOpen(false);
  }

  async function handleSubmit() {
    try {
      if ((window as any).ChannelIO) {
        console.log("🚀 ~ handleSubmit ~ feedback:", feedback);
        (window as any).ChannelIO("track", "Feedback", { feedback });
      }

      // 피드백 제출 후 감사 메시지 모달을 띄우기
      setIsThankYouModalOpen(true);
      onCloseModal();
    } catch (error) {
      console.error("피드백 제출 중 오류가 발생했습니다:", error);
    }
  }

  return (
    <>
      <Modal
        show={isShareFeedbackModalOpen}
        size="md"
        onClose={onCloseModal}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Thank you for your feedback!
            </h3>
            <p>It will be of great help to us.</p>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="feedback" value="Your feedback" />
              </div>
              <TextInput
                id="feedback"
                placeholder=""
                value={feedback}
                onChange={(event) => setFeedback(event.target.value)}
                required
              />
            </div>
            <div className="w-full">
              <Button onClick={handleSubmit}>Submit</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={isThankYouModalOpen}
        size="md"
        onClose={onCloseThankYouModal}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Thank you!
            </h3>
            <p>Your feedback has been successfully submitted.</p>
            <Button onClick={onCloseThankYouModal}>Close</Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
