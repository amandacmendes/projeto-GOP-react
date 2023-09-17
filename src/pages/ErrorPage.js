import '../css/style.css';
import { ContentBase } from '../components/ContentBase';

export function ErrorPage() {
    return (
        <>
            <ContentBase />
            <div className='container'>
                <h1>Ops! Parece que a página que você tentou acessar não existe.</h1>
            </div>
        </>
    );
}

