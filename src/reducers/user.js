const initialState = {
    userId: '',
    username: ''
}
const user = (state = initialState, action) => {
    switch (action.type) {
        case 'USER_AUTHENTICATED': {
            return {
                ...state,
                userId: action.payload.userId,
                username: action.payload.username
            }
        }
        default: return state;
    }
}

export default user;
