import Button from '@Component/Buttons'
import { Topbar } from '@Component/Topbar'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export const PublicProduct = () => {
    const navigate = useNavigate();
    return (
        <div>
            <Topbar leftContent={
                <div className='st-flex st-gap-2'>
                    <Button onClick={navigate('/login')} label='login' />
                    <Button onClick={navigate('/register')} label='Register' />
                </div>
            } />
        </div>
    )
}
