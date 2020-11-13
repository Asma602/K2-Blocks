
//  Import CSS.
import './editor.scss';
import './style.scss';
import { GLOBAL_FONTS } from '../Global_Fonts';

import { GLOBAL_ICONS} from '../Global_Icons'

const { __ } = wp.i18n;
const { registerBlockType,
	AlignmentToolbar,
	// For attribute sources
} = wp.blocks;
const {
	RichText,
	InspectorControls,
	DimensionControl,
} = wp.editor;
const { apiFetch } = wp;
const { Component } = wp.element;

const {
	PanelBody,
	RangeControl,
	SelectControl,
	PanelRow,
	ColorPicker,
	TextControl,
	ToggleControl

} = wp.components;
const postsArr = [];

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new Progress_Bar_Block provided a unique name and an object defining its
 * behavior. Once registered, the Progress_Bar_Block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The Progress_Bar_Block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */

var postBlockIcon=(
	<svg width={800} height={800} viewBox="0 0 800 800">
		<image
			x={161}
			y={343}
			width={477}
			height={111}
			xlinkHref="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAd0AAABvCAMAAACeluqWAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAY1BMVEU2yGo2yGo2yGo2yGo2yGo2yGo2yGo2yGo2yGo2yGo2yGo2yGo2yGo2yGo2yGo2yGo2yGo2yGo2yGo2yGo2yGo2yGo2yGo2yGo2yGo2yGo2yGo2yGo2yGo2yGo2yGo2yGoAAAAcFDiVAAAAH3RSTlMABlam3/nz11VR21IDiVTj5Ftcq6zg+PLZB4qTlFP6t2bvfgAAAAFiS0dEILNrPYAAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQfkBwYBERMA73gBAAABnUlEQVR42u3Wa07CABBF4amA1toWCsUHKu5/l1I0rIDJJCfnW8FNzp8bsWgeVuvNjxgen1ZtEzfPXfUg3Vn38t+2H6qnKMHQX+sal2lY4o7VK5RkvByqbfUIJdk1MVVvUJp9HKonKM0cx+oJSnOM1+oJSrOJ6gVKZF0y65JZl8y6ZNYlsy6ZdcmsS2ZdMuuSWZfMumTWJbMumXXJrEtmXTLrklmXzLpk1iWzLpl1yaxLZl0y65JZl8y6ZNYlsy6ZdcmsS2ZdMuuSWZfMumTWJbMumXXJrEtmXTLrklmXzLpk1iWzLpl1yaxLZl0y65JZl8y6ZNYlsy6ZdcmsS2ZdMuuSWZfMumTWJbMumXXJrEtmXTLrklmXzLpk1iWzLpl1yaxLZl0y65JZl8y6ZNYlsy6ZdcmsS2ZdMuuSWZfMumTWJbMumXXJrEtmXTLrksVb9QKl2cR79QSlOcaheoLSzDFVT1CafTTb6g1KsvuIaKtHKEkbF6fqFUpxWuJG/1m9Qwm++vjz3VVP0Z11Y9w007w+Vw/SnZzX89Rcu/4CtlcBl9E+D6EAAAAASUVORK5CYII="
		/>
		<path fill="#fff" stroke="#040404" d="M322 390h156v17H322z" />
	</svg>
)
var allPostsDesc =[];

registerBlockType( 'k2/post', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-Progress_Bar_Block.
	title: __( 'Posts' ), // Block title.
	icon: {
		src: postBlockIcon
	},
	category: 'k2-blocks', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'Posts' ),
		__( 'Text' ),
	],
	attributes: {
		PostLayout : {
			type:'string',
			default:'classic'
		},
		PostWidgetWidth : {
			type : 'number',
			default: 50
		},
		PostExcerptFontFamily : {
			type: 'string',
			default: 'inherit'
		},
		PostHeadingFontFamily : {
			type: 'string',
			default: 'inherit'
		},
		PostHeadingFontSize : {
			type: 'number',
			default: 18
		},
		PostExcerptFontSize : {
			type: 'number',
			default:   13
		},
		PostExcerptColor : {
			type: 'string',
			default: '#000000'
		},
		PostHeadingColor: {
			type: 'string',
			default: '#000000'
		},
		PostHeadingLineHeight: {
			type: 'number',
			default: 'unset'
		},
		PostExcerptLineHeight: {
			type: 'number',
			default: 'unset'
		},
		PostHeadingVisibility: {
			type: 'boolean',
			default: true
		},
		PostExcerptVisibility: {
			type: 'boolean',
			default: true
		},
		PostHeadingAlignment: {
			type: 'string',
			default: 'left'
		},
		PostExcerptAlignment: {
			type: 'string',
			default: 'left'
		},
		PostHeadingDecoration: {
			type: 'string',
			default: 'none'
		},
		PostExcerptDecoration: {
			type: 'string',
			default: 'none'
		},
		PostHeadingStyle: {
			type: 'string',
			default: 'bold'
		},
		PostExcerptStyle: {
			type: 'string',
			default: 'normal'
		}

	},

	edit: class extends Component{
		constructor(props) {
			super(props);
			this.props = props;
			this.onChangePostLayout =  this.onChangePostLayout.bind(this);
			this.onChangePostExcerptFontFamily = this.onChangePostExcerptFontFamily.bind(this);
			this.onChangePostWidgetWidth = this.onChangePostWidgetWidth.bind(this);
			this.onChangePostHeadingFontFamily = this.onChangePostHeadingFontFamily.bind(this);
			this.onChangePostHeadingFontSize = this.onChangePostHeadingFontSize.bind(this);
			this.onChangePostExcerptFontSize= this.onChangePostExcerptFontSize.bind(this);
			this.onChangePostHeadingColor  = this.onChangePostHeadingColor.bind(this);
			this.onChangePostExcerptColor = this.onChangePostExcerptColor.bind(this);
			this.onChangePostHeadingLineHeight = this.onChangePostHeadingLineHeight.bind(this);
			this.onChangePostExcerptLineHeight = this.onChangePostExcerptLineHeight.bind(this);
			this.onChangePostHeadingVisibility = this.onChangePostHeadingVisibility.bind(this);
			this.onChangePostExcerptVisibility = this.onChangePostExcerptVisibility.bind(this);
			this.onChangePostHeadingAlignment = this.onChangePostHeadingAlignment.bind(this);
			this.onChangePostExcerptAlignment = this.onChangePostExcerptAlignment.bind(this);
			this.onChangePostHeadingDecor  = this.onChangePostHeadingDecor.bind(this);
			this.onChangePostExcerptDecor  = this.onChangePostExcerptDecor.bind(this);
			this.onChangePostHeadingStyle = this.onChangePostHeadingStyle.bind(this);
			this.onChangePostExcerptStyle = this.onChangePostExcerptStyle.bind(this);


			this.state = {
				AllPostsArr : [],
				selectedLayout : 'classic',
				HeadingColor: {
					color: this.props.attributes.PostHeadingColor
				},
				ExcerptColor: {
					color: this.props.attributes.PostExcerptColor
				}
			}

			this.FetchAllPosts()
		}
		FetchAllPosts(){
			apiFetch({ path: "/wp/v2/posts" }).then( posts => {
				this.setState({
					AllPostsArr: posts
				});
			})
		}
		onChangePostLayout(newLayout){
			this.setState({
				selectedLayout: newLayout
			})
			this.props.attributes.PostLayout = newLayout;
		}
		onChangePostExcerptFontFamily(newFamily){
			this.props.setAttributes({
				PostExcerptFontFamily: newFamily
			})
		}

		onChangePostHeadingFontFamily(newFamily){
			this.props.setAttributes({
				PostHeadingFontFamily: newFamily
			})
		}
		onChangePostWidgetWidth(newWidth){
			this.props.setAttributes({
				PostWidgetWidth: newWidth
			})
		}
		onChangePostHeadingFontSize(newSize){
			this.props.setAttributes({
				PostHeadingFontSize: newSize
			})
		}
		onChangePostExcerptFontSize(newSize){
			this.props.setAttributes({
				PostExcerptFontSize: newSize
			})
		}
		onChangePostHeadingLineHeight(newHeight){
			this.props.setAttributes({
				PostHeadingLineHeight: newHeight
			})
		}
		onChangePostExcerptLineHeight(newHeight){
			this.props.setAttributes({
				PostExcerptLineHeight: newHeight
			})
		}
		onChangePostHeadingColor(NewColor){
			this.setState(
				{
					HeadingColor: {
						color: 'rgba('+NewColor.rgb.r+','+NewColor.rgb.g+','+NewColor.rgb.b+','+NewColor.rgb.a+')'
					}
				}
			);
			this.props.setAttributes({
				PostHeadingColor: 'rgba('+NewColor.rgb.r+','+NewColor.rgb.g+','+NewColor.rgb.b+','+NewColor.rgb.a+')'

			})
		}
		onChangePostExcerptColor(NewColor){
			this.setState(
				{
					ExcerptColor: {
						color: 'rgba('+NewColor.rgb.r+','+NewColor.rgb.g+','+NewColor.rgb.b+','+NewColor.rgb.a+')'
					}
				}
			);
			this.props.setAttributes({
				PostExcerptColor: 'rgba('+NewColor.rgb.r+','+NewColor.rgb.g+','+NewColor.rgb.b+','+NewColor.rgb.a+')'

			})
		}
		myFunction(value) {
			var ParentDiv = value.target.parentNode;
			var PopupDiv = ParentDiv.getElementsByTagName('span')
			if (PopupDiv[1].hidden  === true){
				PopupDiv[1].hidden  = false
			} else if (PopupDiv[1].hidden  === false){
				PopupDiv[1].hidden  = true
			}
		}
		onChangePostHeadingVisibility(value){
			this.props.setAttributes({
				PostHeadingVisibility: value
			})
		}
		onChangePostExcerptVisibility(value){
			this.props.setAttributes({
				PostExcerptVisibility: value
			})
		}
		onChangeHeadingAlignmentIconChange(value) {
			if (value.target.tagName === 'SPAN'){
				var MainDiv = document.getElementById("k2-post-inspector-control-text-align");
				var Spans = MainDiv.getElementsByTagName('div');
				for (var i = 0; i < Spans.length; i++) {
					if (Spans[i].getElementsByTagName('span')[0].className.includes('k2-post-active')){
						Spans[i].getElementsByTagName('span')[0].className = Spans[i].getElementsByTagName('span')[0].className.replace('k2-post-active','')
					}
				}
				console.log(value.target.tagName)
				value.target.className = value.target.className + ' k2-post-active'
			}
		}
		onChangeExcerptAlignmentIconChange(value) {
			if (value.target.tagName === 'SPAN'){
				var MainDiv = document.getElementById("k2-post-excerpt-inspector-control-text-align");
				var Spans = MainDiv.getElementsByTagName('div');
				for (var i = 0; i < Spans.length; i++) {
					if (Spans[i].getElementsByTagName('span')[0].className.includes('k2-post-active')){
						Spans[i].getElementsByTagName('span')[0].className = Spans[i].getElementsByTagName('span')[0].className.replace('k2-post-active','')
					}
				}
				console.log(value.target.tagName)
				value.target.className = value.target.className + ' k2-post-active'
			}
		}
		onChangePostHeadingAlignment(newAlign){
			this.props.setAttributes({
				PostHeadingAlignment: newAlign
			})
		}
		onChangePostExcerptAlignment(newAlign){
			this.props.setAttributes({
				PostExcerptAlignment: newAlign
			})
		}
		onChangePostHeadingDecor(newDecor){
			this.props.setAttributes({
				PostHeadingDecoration: newDecor
			})
		}
		onChangePostExcerptDecor(newDecor){
			this.props.setAttributes({
				PostExcerptDecoration: newDecor
			})
		}
		onChangePostHeadingStyle(newStyle){
			this.props.setAttributes({
				PostHeadingStyle: newStyle
			})
		}
		onChangePostExcerptStyle(newStyle){
			this.props.setAttributes({
				PostExcerptStyle: newStyle
			})
		}

		render() {
			const LayoutsAvailable =[
				{ value: 'classic', label: 'Classic'  },
				{ value: 'cover', label: 'Cover'  }
			]
			console.log(this.state.AllPostsArr);

			var layoutSettingSelector = (
				<SelectControl
					label="Select the Layout "
					value={this.state.selectedLayout}
					options= {LayoutsAvailable}
					onChange={ this.onChangePostLayout}
				/>
			);
			var PostWidgetWidthController = (
				<RangeControl
					label={<strong> Widget Width <small>  (rem)</small></strong>}
					value={ this.props.attributes.PostWidgetWidth }
					onChange={ this.onChangePostWidgetWidth }
					min={ this.state.selectedLayout==='classic'?0:55 }
					max={ this.state.selectedLayout==='classic'?50:70 }
					step ={ 1 }
				/>
			);
			var ExcerptFontFamilySelector = (
				<SelectControl
					label={<strong>Font Family</strong>}
					value={this.props.attributes.PostExcerptFontFamily}
					options={GLOBAL_FONTS}
					onChange={this.onChangePostExcerptFontFamily}
				/>
			);
			var HeadingFontFamilySelector = (
				<SelectControl
					label={<strong>Font Family</strong>}
					value={this.props.attributes.PostHeadingFontFamily}
					options={GLOBAL_FONTS}
					onChange={this.onChangePostHeadingFontFamily}
				/>
			);
			var PostHeadingSizeController = (
				<RangeControl
					label={<strong> Font Size <small>  (px)</small></strong>}
					value={ this.props.attributes.PostHeadingFontSize }
					onChange={ this.onChangePostHeadingFontSize }
					min={ 1 }
					max={ 50 }
					step ={ 1 }
				/>
			);
			var PostExcerptSizeController = (
				<RangeControl
					label={<strong> Font Size <small>  (vw)</small></strong>}
					value={ this.props.attributes.PostExcerptFontSize }
					onChange={ this.onChangePostExcerptFontSize }
					min={ 1 }
					max={ 50 }
					step ={ 1 }
				/>
			);
			var PostHeadingLineHeightController = (
				<RangeControl
					label={<strong>Line Height <small>  (em)</small></strong>}
					value={ this.props.attributes.PostHeadingLineHeight }
					onChange={ this.onChangePostHeadingLineHeight }
					min={ 0 }
					max={ 50 }
					step ={0.1}
				/>
			);
			var PostExcerptLineHeightController = (
				<RangeControl
					label={<strong>Line Height <small>  (em)</small></strong>}
					value={ this.props.attributes.PostExcerptLineHeight }
					onChange={ this.onChangePostExcerptLineHeight }
					min={ 0 }
					max={ 50 }
					step ={0.1}
				/>
			);
			var PostHeadingColorPicker = (
				<PanelRow>
					<p><strong> Color</strong></p>
					<div className="k2-ps-popup">
						<span style={{backgroundColor: this.state.HeadingColor}} className={ 'k2-ps-dot' } onClick={ this.myFunction }>
						</span>
						<span className="k2-ps-popup-text" hidden={ true }>
							<div>
								<ColorPicker
									color={ this.state.HeadingColor.color }
									onChangeComplete={ this.onChangePostHeadingColor }
								/>
								<TextControl
									onChange={ ( value ) => {
										this.props.setAttributes( { titleColor: value } )
										this.setState({HeadingColor: {
												color: value
											}})
									} }
									value={ this.state.HeadingColor.color  }
								/>
							</div>
						</span>
					</div>
				</PanelRow>
			);
			var PostExcerptColorPicker = (
				<PanelRow>
					<p><strong>Color</strong></p>
					<div className="k2-ps-popup">
						<span style={{backgroundColor: this.state.ExcerptColor}} className={ 'k2-ps-dot' } onClick={ this.myFunction }>
						</span>
						<span className="k2-ps-popup-text" hidden={ true }>
							<div>
								<ColorPicker
									color={ this.state.ExcerptColor.color }
									onChangeComplete={ this.onChangePostExcerptColor }
								/>
								<TextControl
									onChange={ ( value ) => {
										this.props.setAttributes( { titleColor: value } )
										this.setState({ExcerptColor: {
												color: value
											}})
									} }
									value={ this.state.ExcerptColor.color  }
								/>
							</div>
						</span>
					</div>
				</PanelRow>
			)
			var PostHeadingToggle = (
				<PanelRow>
					<p>Heading</p>

					<ToggleControl
						checked = {this.props.attributes.PostHeadingVisibility}
						onChange = {this.onChangePostHeadingVisibility}
					/>
				</PanelRow>
			);
			var PostExcerptToggle = (
				<PanelRow>
					<p>Text</p>
					<ToggleControl
						checked = {this.props.attributes.PostExcerptVisibility}
						onChange = {this.onChangePostExcerptVisibility}
					/>

				</PanelRow>
			);
			var PostHeadingAlignmennt = (
				<PanelRow>
					<div style={{paddingBottom: '2%'}}>
						<label><strong> Align</strong></label>
					</div>
					<div id ="k2-post-inspector-control-text-align" className={'k2-post-inspector-control-classic-position'} onClick={this.onChangeHeadingAlignmentIconChange}>

						<div className={'k2-post-inspector-control-classic-position-single'}  onClick={() => this.onChangePostHeadingAlignment('left')}>
							<span className="fa fa-align-left k2-post-alignment-icon k2-post-active" ></span>
						</div>
						<div className={'k2-post-inspector-control-classic-position-single'} onClick={() => this.onChangePostHeadingAlignment('center')}>
							<span className="fa fa-align-center k2-post-alignment-icon "></span>
						</div>
						<div className={'k2-post-inspector-control-classic-position-single'} onClick={() => this.onChangePostHeadingAlignment('right')}>
							<span className="fa fa-align-right k2-post-alignment-icon"></span>
						</div>
					</div>
				</PanelRow>
			);
			var PostExcerptAlignmennt = (
				<PanelRow>
					<div style={{paddingBottom: '2%'}}>
						<label><strong> Align</strong></label>
					</div>
					<div id ="k2-post-excerpt-inspector-control-text-align" className={'k2-post-inspector-control-classic-position'} onClick={this.onChangeExcerptAlignmentIconChange}>

						<div className={'k2-post-inspector-control-classic-position-single'}  onClick={() => this.onChangePostExcerptAlignment('left')}>
							<span className="fa fa-align-left k2-post-alignment-icon k2-post-active" ></span>
						</div>
						<div className={'k2-post-inspector-control-classic-position-single'} onClick={() => this.onChangePostExcerptAlignment('center')}>
							<span className="fa fa-align-center k2-post-alignment-icon "></span>
						</div>
						<div className={'k2-post-inspector-control-classic-position-single'} onClick={() => this.onChangePostExcerptAlignment('right')}>
							<span className="fa fa-align-right k2-post-alignment-icon"></span>
						</div>
					</div>
				</PanelRow>
			);
			var PostHeadingDecor = (
				<SelectControl
					label={<strong>Decoration</strong>}
					value={ this.props.attributes.PostHeadingDecoration }
					options={
						[
							{ label: 'None', value: 'None' },
							{ label: 'underline', value: 'underline' },
							{ label: 'overline', value: 'overline' },
							{ label: 'line-through', value: 'line-through' },
						]
					}
					onChange={ this.onChangePostHeadingDecor}
				/>
			);
			var PostExcerptDecor = (
				<SelectControl
					label={<strong>Decoration</strong>}
					value={ this.props.attributes.PostExcerptDecoration }
					options={
						[
							{ label: 'None', value: 'None' },
							{ label: 'underline', value: 'underline' },
							{ label: 'overline', value: 'overline' },
							{ label: 'line-through', value: 'line-through' },
						]
					}
					onChange={ this.onChangePostExcerptDecor}
				/>
			);
			var PostHeadingStyle = (
				<SelectControl
					label={<strong>Style</strong>}
					value={ this.props.attributes.PostHeadingStyle }
					options={
						[
							{ label: 'Normal', value: 'normal' },
							{ label: 'Bold', value: 'bold' },
							{ label: 'Italic', value: 'italic' },
						]
					}
					onChange={ this.onChangePostHeadingStyle}
				/>
			);
			var PostExcerptStyle = (
				<SelectControl
					label={<strong>Style</strong>}
					value={ this.props.attributes.PostExcerptStyle }
					options={
						[
							{ label: 'Normal', value: 'normal' },
							{ label: 'Bold', value: 'bold' },
							{ label: 'Bolder', value: 'bolder' },
							{ label: 'Italic', value: 'italic' },
						]
					}
					onChange={ this.onChangePostExcerptStyle}
				/>
			);

			const postWidgetStyles = {
				width : this.props.attributes.PostWidgetWidth +   'rem'
			}
			const postExcerptTypography = {
				fontFamily: this.props.attributes.PostExcerptFontFamily,
				fontSize: this.props.attributes.PostExcerptFontSize + 'px',
				lineHeight: this.props.attributes.PostExcerptLineHeight + 'em',
				color: this.props.attributes.PostExcerptColor,
				display: this.props.attributes.PostExcerptVisibility===true?'block':'none',
				textAlign: this.props.attributes.PostExcerptAlignment,
				fontStyle: this.props.attributes.PostExcerptStyle,
				textDecoration: this.props.attributes.PostExcerptDecoration

			}
			const postHeadingTypography = {
				fontFamily: this.props.attributes.PostHeadingFontFamily,
				fontSize: this.props.attributes.PostHeadingFontSize + 'px',
				color: this.props.attributes.PostHeadingColor,
				lineHeight: this.props.attributes.PostHeadingLineHeight + 'em',
				display: this.props.attributes.PostHeadingVisibility===true?'block':'none',
				textAlign: this.props.attributes.PostHeadingAlignment,
				fontStyle: this.props.attributes.PostHeadingStyle,
				textDecoration: this.props.attributes.PostHeadingDecoration

			}

			allPostsDesc =[];
			let titles = this.state.AllPostsArr.map(post => post.title.rendered);
			let authors_name = this.state.AllPostsArr.map(post => post.uagb_author_info.display_name);
			let authors_link = this.state.AllPostsArr.map(post => post.uagb_author_info.author_link);
			let content = this.state.AllPostsArr.map(post => post.uagb_excerpt.substring(0,100));
			let postLinks = this.state.AllPostsArr.map(post => post.link);
			let featuredImgs = this.state.AllPostsArr.map(post => post.uagb_featured_image_src.medium[0]);
			let coverImgs = this.state.AllPostsArr.map(post => post.uagb_featured_image_src.large[0]);
			let datePublished = this.state.AllPostsArr.map(post => new Date(post.date));
			for(let i=0;i<this.state.AllPostsArr.length;i++){


				if(this.props.attributes.PostLayout==='cover'){
					var postDesc =(
						<div className="card-cover"  style={postWidgetStyles}>
							<div className="container">
								<div className="card-body-cover" style={{backgroundImage:'url('+coverImgs[i]+')'}} >
									<span className="post-heading" style={postHeadingTypography}>{titles[i]}</span>
									<span style={postExcerptTypography} className="post-content">{ content[i] }...</span>
									<button className="read-btn btn-black"><a href={postLinks[i]}>Read More...</a></button><br/>
								</div>
								<div className="postInfo">
									<div className="floatDate">
										<span><i className="fa fa-calendar removeItalic" ></i>{ datePublished[i].toLocaleDateString()}</span>

									</div>
								</div>


							</div>
						</div>
					);
				}
				else{
					var postDesc = (
						<div className="card"  style={postWidgetStyles}>
							<div className="container">
								<div className="postInfo">
									<div>
										<span> <i className="fa fa-user removeItalic"></i> <a href={authors_link[i]}>{authors_name[i]}</a></span><br/>
									</div>
									<div className="floatDate">
										<span><i className="fa fa-calendar removeItalic" ></i>{ datePublished[i].toLocaleDateString()}</span>
									</div>
								</div>
								<div className="card-body">
									<span className="post-heading" style={postHeadingTypography}>{titles[i]}</span>
									<img src={featuredImgs[i]} alt="No Image Attached!!"/>
									<span style={postExcerptTypography} className="post-content">{ content[i] }...</span>
									<button className="read-btn btn-black"><a href={postLinks[i]}>Read More...</a></button><br/>
								</div>
							</div>
						</div>
					);
				}

				allPostsDesc.push(postDesc)
			}
			return ([
				<InspectorControls>
					<PanelBody title={'Layout Settings'}>
						{layoutSettingSelector}
						{PostWidgetWidthController}
					</PanelBody>

					<PanelBody title={'Heading'}>
						{ PostHeadingToggle }
						{ PostHeadingAlignmennt }
						{HeadingFontFamilySelector}
						{PostHeadingSizeController}
						{ PostHeadingStyle }
						{ PostHeadingDecor }
						{ PostHeadingLineHeightController }
						{PostHeadingColorPicker}
					</PanelBody>
					<PanelBody title={'Excerpt'}>
						{ PostExcerptToggle }
						{ PostExcerptAlignmennt }
						{ExcerptFontFamilySelector}
						{PostExcerptSizeController}
						{ PostExcerptStyle }
						{ PostExcerptDecor }
						{PostExcerptLineHeightController}
						{ PostExcerptColorPicker }

					</PanelBody>

				</InspectorControls>,

				<div >{ allPostsDesc }</div>
			]);
			}
	},

	save( { attributes } ) {
		return <div>{ allPostsDesc }</div>
	},

});
