export const validateGenerateDataBody = (body) => {
  let bodyValid = body && body.users && body.pets;
  bodyValid =
    bodyValid &&
    typeof body.users === 'number' &&
    typeof body.pets === 'number';
  return bodyValid;
};
