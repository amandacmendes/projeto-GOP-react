import '../css/style.css';
import { ContentBase } from '../components/ContentBase';
import error_img from '../img/404-error.png'
import { Image } from 'react-bootstrap';

export function ErrorPage() {
    return (
        <>
            {sessionStorage.getItem('id') &&
                <ContentBase />
            }
            <div className='container'>
                <h1 className='py-4 text-center'>Ops! Parece que a página que você tentou acessar não existe.</h1>
                <div className='d-flex h-100 align-content-middle justify-content-center'>
                    <Image src={error_img} className='img-fluid' style={{ maxWidth: '40%', maxHeight: '40%' }} />
                </div>
            </div>
        </>
    );
}

