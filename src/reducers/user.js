const initialState = {
    userId: '',
}
const user = (state = initialState, action) => {
    switch (action.type) {
        case 'USER_AUTHENTICATED': {
            return {
                ...state,
                userId: action.payload.userId
            }
        }
        default: return state;
    }
}

export default user;
