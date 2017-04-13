const Types = {
  STARTUP: "STARTUP"
};

const Creators = {
  startup: () => ({type: Types.STARTUP})
};

export const StartupTypes = Types;
export default Creators;