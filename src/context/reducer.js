export const initialState = {
    map: null,
    user:null
  };
  
  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_MAP":
        return {
          ...state,
          map: action.map,
        };
        
        case "SET_USER":
          return {
            ...state,
            user: action.user
          }
      default:
        return state;
    }
  };
  export default reducer;
  