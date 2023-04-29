import React from 'react';
import {FormProvider, useForm} from "react-hook-form";
import s from "./style.module.scss";
import InputStyled from "@/shared/ui/InputStyled";
import {Button} from "@mui/material";
import * as api from "@/shared/api";
import {setCookie} from "nookies";
import {useAppDispatch} from "@/app/store/store";
import {addAlertWithCustomText} from "@/shared/ui/Alert/alertReducer";
import {useRouter} from "next/router";


type SchemaLogin = {
    email: string;
    password: string;
}

const LoginPage = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()

    const methods = useForm<SchemaLogin>({
        mode: 'onSubmit',
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = async (data: SchemaLogin) => {
        try {
            const {token} = await api.auth.login(data)
            setCookie(null,"_token",token,{
                path:'/',
            })
            await router.push('/admin')
        } catch (e:any) {
            dispatch(addAlertWithCustomText(e.response.data.error_code))
            await router.push('/register')
        }
    }

    const handlerRegister = async () => {
        await router.push('/register')
    }

    return (
        <div className={s.login}>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <div className={s.form}>
                        <InputStyled name='email' options={{required: {value:true,message:'Обязательное поле'}}} label="Email"/>
                        <InputStyled name='password' options={{required: {value:true,message:'Обязательное поле'}}} label="Password" type='password'/>
                        <Button variant='outlined' type='submit'>Войти</Button>
                        <Button onClick={handlerRegister} variant='outlined' type='button'>Зарегистрироваться</Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default LoginPage;