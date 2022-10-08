const Forgot = () => {
    return(
        <form style={styles.form}>
            <h2 style={styles.formTitle}>password reset</h2>
            <input type='text' style={styles.inputField} placeholder="email" />
            <div style={styles.login_btn}>
                <button style={styles.btn}>send</button>
            </div>
        </form>
    )
}

export default Forgot

const styles = {
    form:{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '120px',
        background: 'white',
        borderRadius: '15px'
    },
    formTitle:{
        fontSize: '40px',
        textTransform: 'uppercase',
        marginTop: 0
    },
    inputField:{
        padding:'10px',
        fontSize: '24px',
        width: '200px',
        fontFamily: 'League Gothic, sans-serif',
        letterSpacing: '1px',
        marginBottom: '2rem',
        fontWeight: '400'
    },
    btn:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#273fe3',
        border: 0,
        padding: '12px',
        fontSize: '20px',
        fontFamily: 'League Gothic, sans-serif',
        color: 'white',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        cursor: 'pointer',
        width: '80px',
        marginRight: '10px',
        borderRadius: '4px'
    },
}