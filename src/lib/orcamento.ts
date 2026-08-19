/** Evento disparado pelos cards de escopo para pré-selecionar o formulário. */
export const EVENTO_ESCOPO = 'cepromed:escopo';

export function pedirOrcamento(titulo: string) {
  window.dispatchEvent(new CustomEvent<string>(EVENTO_ESCOPO, { detail: titulo }));
}
