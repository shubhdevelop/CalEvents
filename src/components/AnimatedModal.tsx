"use client";
import React from "react";
import { Modal, ModalBody, ModalContent, ModalTrigger } from "./ui/animated-modal";

export function AnimatedModal({ children, trigger }: { children: React.ReactNode, trigger: React.ReactNode }) {
    return (
        <div className="  flex items-center justify-center">
            <Modal >
                <ModalTrigger >
                    {trigger}
                </ModalTrigger>
                <ModalBody >
                    <ModalContent>
                        {children}
                    </ModalContent>
                </ModalBody>
            </Modal>
        </div>
    );
}
