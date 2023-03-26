export enum AlertTypes {
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  DANGER = 'danger',
  SECONDARY = 'secondary',
  // PRIMARY = 'primary',
  // LIGHT = 'light',
  // DARK = 'dark',
}

export const AlertTypeTailwindColor = Object.freeze({
  [AlertTypes.SUCCESS]: `green`,
  [AlertTypes.INFO]: `blue`,
  [AlertTypes.WARNING]: `yellow`,
  [AlertTypes.DANGER]: `red`,
  [AlertTypes.SECONDARY]: `slate`,
  // [AlertTypes.PRIMARY]: ``,
  // [AlertTypes.LIGHT]: ``,
  // [AlertTypes.DARK]: ``,
});

export const AlertDivClass = Object.freeze({
  [AlertTypes.SUCCESS]: `bg-green-100 border-green-400 text-green-700`,
  [AlertTypes.INFO]: `bg-blue-100 border-blue-400 text-blue-700`,
  [AlertTypes.WARNING]: `bg-yellow-100 border-yellow-400 text-yellow-700`,
  [AlertTypes.DANGER]: `bg-red-100 border-red-400 text-red-700`,
  [AlertTypes.SECONDARY]: `bg-slate-100 border-slate-400 text-slate-700`,
});

export const AlertTextClass = Object.freeze({
  [AlertTypes.SUCCESS]: `text-green-500`,
  [AlertTypes.INFO]: `text-blue-500`,
  [AlertTypes.WARNING]: `text-yellow-500`,
  [AlertTypes.DANGER]: `text-red-500`,
  [AlertTypes.SECONDARY]: `text-slate-500`,
});