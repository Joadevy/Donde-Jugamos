/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import {useRef} from "react";

interface PaymentProps {
  paymentConfirmation: string;
  description?: boolean;
}

const PaymentConfirmationThumbnail: React.FC<PaymentProps> = ({
  paymentConfirmation,
  description = false,
}) => {
  const imgRef = useRef<null | HTMLImageElement>(null);

  // Funcion auxiliar para abrir la imagen del comprobante pago a fullscreen
  const openFullscreen = () => {
    if (!imgRef.current) return;

    const imgEl: any = imgRef.current;

    if (imgEl.requestFullscreen) {
      imgEl.requestFullscreen();
    } else if (imgEl.mozRequestFullScreen) {
      /* Firefox */
      imgEl.mozRequestFullScreen();
    } else if (imgEl.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      imgEl.webkitRequestFullscreen();
    } else if (imgEl.msRequestFullscreen) {
      /* IE/Edge */
      imgEl.msRequestFullscreen();
    }
  };

  return (
    <>
      {paymentConfirmation ? (
        <div className="flex flex-col">
          <button
            className="w-14 h-14 lg:h-24 lg:w-24 border rounded-sm border-slate-200 mt-2 overflow-hidden
                           hover:opacity-75 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              openFullscreen();
            }}
          >
            <img
              ref={imgRef}
              alt="Comprobante de pago asociado a la reserva"
              className="w-full h-full"
              role="button"
              src={paymentConfirmation}
            />
          </button>
          {description ? (
            <p className="text-sm lg:text-xs italic text-slate-400">Comprobante cargado</p>
          ) : null}
        </div>
      ) : null}
    </>
  );
};

export default PaymentConfirmationThumbnail;
