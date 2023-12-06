import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "../ui/accordion";

function AccordionQA() {
  return (
    <Accordion collapsible className="w-full" type="single">
      <AccordionItem value="item-1">
        <AccordionTrigger>Que es donde jugamos?</AccordionTrigger>
        <AccordionContent>
          ⁖ Somos una aplicacion de reserva de turnos para establecimientos deportivos, te ofrecemos
          una amplia variedad de canchas y una forma facil y directa para reservarlas.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger>Porque necesito iniciar sesion?</AccordionTrigger>
        <AccordionContent>
          ⁖ Necesitamos conocer algunos de tus datos para hacer el proceso de reserva mas seguro
          para todos.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionTrigger>Puedo cancelar una reserva?</AccordionTrigger>
        <AccordionContent>
          ⁖ Si, podras cancelar una reserva una vez realizada dependiendo de las plazos del
          establecimiento.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default AccordionQA;
