import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.scss';


const SideNav = () => (
	<header className={`padded dark ${style.this}`}>
		<h1 className={style.logo}>JSCodeShaft</h1>
		<nav>
			<ol className={style.navList}>
				<li>
					<a href="#">Intro</a>
				</li>
				<li>
					<a href="#">JsCodeShft API</a>
				</li>
				<li>
					<a href="#">JsCodeShaft API</a>
					<ol className={style.chapters}>
						<li>
							<Link href="/jscodeshaft/attributes/">Attributes</Link>

							<ol className={style.pages}>
								<li>
									<a href="#">getAttrs</a>
								</li>
								<li>
									<a href="#">createAttr</a>
								</li>
								<li>
									<a href="#">removeAttrs</a>
								</li>
								<li>
									<a href="#">addAttrs</a>
								</li>
								<li>
									<a href="#">renameAttr</a>
								</li>
								<li>
									<a href="#">setAttrValue</a>
								</li>
								<li>
									<a href="#">swapAttr</a>
								</li>
							</ol>
						</li>
						<li>
							<a href="#">Nodes</a>
						</li>
						<li>
							<a href="#">ClassNames</a>
						</li>
						<li>
							<a href="#">Imports</a>
						</li>
						<li>
							<a href="#">Traversal</a>
						</li>
						<li>
							<a href="#">Type-checking</a>
						</li>
					</ol>
				</li>
			</ol>
		</nav>
	</header>
);

export default SideNav;
