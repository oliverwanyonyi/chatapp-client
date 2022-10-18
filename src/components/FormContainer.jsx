import React from 'react'
import styled from 'styled-components'
const FormContainer = ({children}) => {
  return (
    <Container>
        {children}
    </Container>
  )
}

const Container = styled.div`
    width:100vw;
    height:100vh;
    display:flex;
    align-items: center;
    justify-content: center;
    background: #ececec;
    .form{
        padding: 15px 20px;
        background: #ffffff;
        border:2px solid #6c37f3;;
        width:400px;
        border-radius: 10px;
        color:#292929;
        h3{
            color: #6c37f3;
            padding: 20px 0;
            text-align: center;
            font-size: 18px;
        }
        .form-group{
            margin-bottom: 20px;
            &.upload-group{
                display: flex;
                align-items: center;
                justify-content: space-between;
                label{
                    background: #ececec;
                    color: #6c37f3;
                    padding: 10px 15px;
                    border-radius: 10px;
                    cursor: pointer;
                }
            }
            .avatar{
                width:7rem;
                height: 7rem;
                border-radius: 50%;
                overflow: hidden;
                margin-bottom: 10px;
                border: 3px solid #6c37f3;
                img{
                    width:100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
            .form-label{
                margin-bottom: 10px;
                font-size: 14px;
                display: block;
            }
            .form-control{
                width:100%;
                padding:10px 20px;
                border:2px solid #8b64ef;
                border-radius: 5px;
                &:focus{
                    outline: 3px solid #6c37f3;
                }
            }
        }
            button{
                background: #6c37f3;
                color: #ffffff;
                width: 100%;
                cursor: pointer;
                padding: 13px 0;
                border-radius: 5px;
                font-size: 14px;
                transition:500ms ease-in-out;
                &:hover, &:disabled{
                    background: #8b64ef;
                }
                &:disabled{
                    cursor: not-allowed;
                }
            }
            span{
                display: block;
                padding:20px 0;
                font-size: 16px;
                text-align: center;
                a{
                    color: #6c37f3;
                    text-decoration: underline;
                }
            }
        
    }
`

export default FormContainer